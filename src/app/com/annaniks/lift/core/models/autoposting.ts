export interface CreatePostData {
    accountId: string;
    usertags: {
        in: UserTag[];
    };
    location: Location;
    caption: string;
    time: string;
    file: File;
}

interface UserTag {
    user_id: string;
    position: number[];
}

interface Location {
    pk: string;
    name: string;
    address: string;
    city: string;
    short_name: string;
    lng: number;
    lat: number;
    external_id_source: string;
    external_id: number;
}