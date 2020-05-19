import {Component, HostListener, OnInit} from '@angular/core';

import {AlertController, ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {HttpclientService} from './service/httpclient.service';
import {UserModalComponent} from './user-modal/user-modal.component';
import {AuthenticationService} from './service/authentication.service';
import {Router} from '@angular/router';
import {AppPage} from "../../e2e/src/app.po";


import { Subject }    from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public selectedIndex = 0;
    private user;
    username: string;
    password: string;
    error = '';
    private location;
    public title = "Feed";
    private mobileMode = false;
    private mobileWidth = 992;
    private allUnreadHighLevelList;

    public appPages = [
        {
            title: 'Feed',
            url: '/folder/Feed',
            icon: 'home',
            accessPermission: 'USER'
        },
        {
            title: 'Maak Account',
            url: '/folder/Create',
            icon: 'person',
            accessPermission: 'ADMIN'
        },
        {
            title: 'Analytics',
            url: '/folder/Analytics',
            icon: 'analytics',
            accessPermission: 'ADMIN'
        },
        {
            title: 'Profiel',
            url: '/folder/Profile',
            icon: 'mail',
            accessPermission: 'USER'
        }
    ];
    public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private httpclient: HttpclientService,
        private loginService: AuthenticationService,
        private router: Router,
        private alertController: AlertController,
        private modalController: ModalController
    ) {
        console.log(window.location);
        // this.httpclient.getUserFromNeo4J().subscribe(res => this.user = res);
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    clickedMenuButton(index) {
        this.title = this.appPages[index].title;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if(window.innerWidth < this.mobileWidth && !this.mobileMode){
            this.mobileMode = true;
        } else if(window.innerWidth >= this.mobileWidth && this.mobileMode){
            this.mobileMode = false;
        };
    }

    onLogout() {
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('jwtToken');
        this.router.navigate(['']);
    }

    onLogin() {
        (this.loginService.authenticate(this.username, this.password).subscribe(
                data => {
                    // if ( data === 'NOPERMISSIONS') {
                    //   this.error = 'No permissions to access this platform.';
                    // } else {
                    // this.alertService.presentToast('Logged In');
                    this.router.navigate(['/main-menu']);
                    this.error = '';
                    this.httpclient.getUserFromNeo4J().subscribe(
                        user => {
                            this.user = user;
                            sessionStorage.setItem('username', this.user.name);
                        }
                    );
                    this.httpclient.getUserFromNeo4J().subscribe(res => {
                        this.user = res;
                        this.httpclient
                            .getAllUnreadHighLevelMessages(this.user.username)
                            .subscribe(messages => {
                                this.allUnreadHighLevelList = messages;
                                if (this.allUnreadHighLevelList.length > 0) {
                                    this.presentUnreadMessagesAlert();
                                }
                            });
                    });
                    // }
                },
                error => {
                    if ( error.status === 0) {
                        this.error = 'Service Temporarily Unavailable';
                    } else {
                        this.error = 'Incorrect Username of Wachtwoord';
                    }
                }
            )
        );
        this.username = this.password = '';
    }
    userHasAccess(page){
        if(page.accessPermission == "USER"){
            return true;
        }
        if(page.accessPermission == "ADMIN" && this.user.role == "ADMIN"){
            return true;
        } else {
            return false;
        }

    }

    async presentUnreadMessagesAlert() {
        const alert = await this.alertController.create({
            header: 'Ongelezen berichten',
            cssClass: 'alertDanger',
            message: 'Je heb belangrijke berichten die niet gelezen zijn, wil je die nu lezen?',
            buttons: ['Niet nu', {
                text: 'Lees',
                role: 'Read',
                handler: () => {
                    this.presentModal();
                }
            }]
        });
        await alert.present();
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: UserModalComponent,
            cssClass: 'custom-modal',
            componentProps: {
                list: this.allUnreadHighLevelList
            }
        });
        return await modal.present();
    }

    ngOnInit() {
        if (sessionStorage.getItem('username') != null) {
             this.httpclient.getUserFromNeo4J().subscribe(
                 user => {
                     this.user = user;
                     sessionStorage.setItem('username', this.user.name);
                 }
            );
        }
        this.location = window.location.pathname;
        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }
    }

}

