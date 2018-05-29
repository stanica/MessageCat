import { Component } from '@angular/core';
import { UserService } from '../../components/auth/user.service';

@Component({
    selector: 'learning-management',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminLearningComponent {
    static parameters = [UserService];
    constructor(userService) {
        this.userService = userService;
        // Use the user service to fetch all users
        this.userService.query().subscribe(users => {
            this.users = users;
        });
    }
}
