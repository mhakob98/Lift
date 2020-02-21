import { Component, OnInit, OnDestroy, Input, AfterViewInit, EventEmitter, Output, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../profile.service';
import { Subject, Observable, forkJoin, throwError } from 'rxjs';
import { takeUntil, finalize, switchMap, map, catchError } from 'rxjs/operators';
import { ChangeMe } from 'src/app/com/annaniks/lift/core/models/change-me';
import { User, InstagramAccount } from 'src/app/com/annaniks/lift/core/models/user';
import { MainService } from '../../../main.service';
import { LoadingService } from 'src/app/com/annaniks/lift/core/services/loading-service';
import { AuthService } from 'src/app/com/annaniks/lift/core/services/auth.service';
import { EmptyResponse } from 'src/app/com/annaniks/lift/core/models/empty-response';
import { ToastrService } from 'ngx-toastr';
import { ServerResponse } from 'src/app/com/annaniks/lift/core/models/server-response';

@Component({
    selector: "personal-settings",
    templateUrl: "personal-settings.component.html",
    styleUrls: ["personal-settings.component.scss"]
})

export class PersonalSettings implements OnInit, OnDestroy {
    @Input('user')
    set _userData(event) {
        this._formBuilder();
        if (event) {
            this.user = event;
            this.localImage = (this.user && this.user.avatar) ? `${this._fileUrl}/${this.user.avatar}` : 'assets/images/user.png';
            this._bindPersonalSettings(event);
        }
    }
    @Output('nextTab')
    private _nextTab = new EventEmitter<number>();
    private _unsubscribe$: Subject<void> = new Subject<void>();
    public localImage: string = 'assets/images/user.png';
    public dataForm: FormGroup;
    public contactForm: FormGroup;
    public loading: boolean = false;
    public user: User = {} as User;
    public userAccounts: InstagramAccount[] = [];
    public userImage: File;

    constructor(
        private _fb: FormBuilder,
        private _profileService: ProfileService,
        private _mainService: MainService,
        private _authService: AuthService,
        private _loadingService: LoadingService,
        @Inject('FILE_URL') private _fileUrl: string,
        private _toastrService: ToastrService
    ) { }

    ngOnInit() {
        this._getUser();
    }

    private _formBuilder(): void {
        this.dataForm = this._fb.group({
            name: ["", Validators.required],
            day: [null, Validators.required],
            month: ["", Validators.required],
            year: ["", Validators.required],
            male: [true, Validators.required]
        })
        this.contactForm = this._fb.group({
            phoneNumber: ["", Validators.required],
            currentCity: ["", Validators.required]
        })

    }

    private _getUser(): void {
        this._authService.getUserState()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((data) => {
                if (!!data) {
                    this.userAccounts = data.instagramAccounts;
                }
            })
    }

    private _refreshUser(): Observable<ServerResponse<User>> {
        this._loadingService.showLoading();
        return this._mainService.getMe()
            .pipe(
                finalize(() => {
                    this._loadingService.hideLoading();
                })
            );
    }

    private _bindPersonalSettings(settings): void {
        this.contactForm.patchValue({
            phoneNumber: settings.phone,
            currentCity: settings.city
        })
        this.dataForm.patchValue({
            male: settings.male,
            name: settings.name,
            day: settings.dbDay ? settings.dbDay.toString() : null,
            month: settings.dbMount ? settings.dbMount.toString() : null,
            year: settings.dbYear ? settings.dbYear.toString() : null,
        })
    }

    private _changeUserData(userData: ChangeMe): Observable<EmptyResponse> {
        return this._profileService.changeMe(userData)
            .pipe(
                map((data) => data.data)
            )
    }

    private _changeUserImage(): Observable<EmptyResponse> {
        return this._profileService.changeUserPhoto(this.userImage)
            .pipe(map((data) => data.data));
    }

    public deleteInstagramAccount(id: number): void {
        this._loadingService.showLoading();
        this._mainService.deleteInstaAccount(id).pipe(
            finalize(() => this._loadingService.hideLoading()),
            takeUntil(this._unsubscribe$),
            switchMap(() => {
                const activeAccount = this._authService.getAccount();
                if (activeAccount && activeAccount.id && (id === activeAccount.id)) {
                    this._authService.setAccount({} as InstagramAccount);
                }
                return this._refreshUser();
            })
        ).subscribe();
    }

    public checkIsValid(formGroup, cotrolName): boolean {
        return formGroup.get(cotrolName).hasError('required') && formGroup.get(cotrolName).touched;
    }

    public onClickAddAccount(): void {
        this._mainService.openAccountConnectionModal({ isFirstAccount: false });
    }

    public changeMe(): void {
        this.loading = true;
        let dataForm = this.dataForm.value;
        let contactForm = this.contactForm.value;
        let sendingData: ChangeMe = {
            name: dataForm.name,
            male: dataForm.male,
            dbDay: +dataForm.day,
            dbMount: +dataForm.month,
            dbYear: +dataForm.year,
            city: contactForm.currentCity,
            phone: contactForm.phoneNumber,
        }
        const requests = [this._changeUserData(sendingData)]
        if (this.userImage) {
            requests.push(this._changeUserImage())
        }
        forkJoin(requests)
            .pipe(
                finalize(() => this.loading = false),
                switchMap(() => {
                    this._nextTab.emit(3);
                    this._toastrService.success('Изменение сохранены');
                    return this._refreshUser();
                }),
                catchError((err) => {
                    this._toastrService.error('Ошибка');
                    return throwError(err);
                })
            )
            .subscribe()
    }

    public changePhoto($event): void {
        const fileList: FileList = $event.target.files;
        if (fileList && fileList[0]) {
            this.userImage = fileList[0];
            const file: File = fileList[0];
            const reader: FileReader = new FileReader();
            reader.onload = (event: any) => {
                this.localImage = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    ngOnDestroy() {
        this._unsubscribe$.next();
        this._unsubscribe$.unsubscribe();
    }
}