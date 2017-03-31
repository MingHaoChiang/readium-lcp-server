import { Injectable }   from '@angular/core';
import { Http }         from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as  jsSHA      from 'jssha';

import { User }         from './user';

import { CrudService }  from '../crud/crud.service';

declare var Config: any; //  this comes from the autogenerated config.js file

@Injectable()
export class UserService extends CrudService<User> {
    constructor (http: Http) {
        super();
        this.http = http;
        this.baseUrl = Config.frontend.url + '/api/v1/users';
    }

    decode(jsonObj: any): User {
        return {
            id: jsonObj.id,
            uuid: jsonObj.uuid,
            name: jsonObj.name,
            email: jsonObj.email,
            password: jsonObj.password,
            clearPassword: null
        }
    }

    encode(obj: User): any {
        let jsonObj = {
            id: obj.id,
            uuid: obj.uuid,
            name: obj.name,
            email: obj.email,
            password: obj.password
        };

        if (obj.clearPassword == null) {
            // No password change
            return jsonObj;
        }

        // Hash password
        let jsSHAObject:jsSHA.jsSHA = new jsSHA("SHA-256", "TEXT");
        jsSHAObject.update(obj.clearPassword);
        jsonObj['password'] =  jsSHAObject.getHash("HEX");
        return jsonObj;
    }
}