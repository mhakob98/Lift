import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api'

@Injectable({
    providedIn: 'root'
})
export class MockServerService implements InMemoryDbService {

    constructor() { }

    createDb() {
        const posts = [
            { id: 1, user: 'PO1', title: '', description: 'Insurance policy number PO1', img: '' },
            { id: 2, user: 'PO1', title: '', description: 'Insurance policy number PO1', img: '' },
            { id: 3, user: 'PO1', title: '', description: 'Insurance policy number PO1', img: '' },
            { id: 4, user: 'PO1', title: '', description: 'Insurance policy number PO1', img: '' },
            { id: 5, user: 'PO1', title: '', description: 'Insurance policy number PO1', img: '' },

        ];
        return { posts };
    }
}