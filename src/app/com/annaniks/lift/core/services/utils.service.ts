import { HttpParams } from '@angular/common/http';

export class UtilsService {

    public static createFormData<T>(body: T): FormData {
        const formData: FormData = new FormData();
        if (body) {
            const keys: string[] = Object.keys(body);
            keys.map((element, index) => {
                if (body[element]) {
                    if (body[element] instanceof File) {
                        const file = body[element];
                        formData.append(element, file, file.name);
                    }
                    else {
                        formData.append(element, JSON.stringify(body[element]));
                    }
                }
            })
        }
        return formData;
    }

    public static createHttpParams<T>(body: T): HttpParams {
        let params = new HttpParams();
        if (body) {
            const keys = Object.keys(body);
            if (keys && keys.length > 0) {
                keys.map((element: string, index: number) => {
                    if (body[element]) {
                        params = params.append(element, body[element].toString())
                    }
                })
            }
        }
        return params;
    }
}