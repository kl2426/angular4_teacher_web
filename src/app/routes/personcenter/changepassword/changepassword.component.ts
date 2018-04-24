import { Component, OnInit, Injector } from '@angular/core';
import { NzNotificationService, NzModalService, NzMessageService  } from 'ng-zorro-antd';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import { ChangepasswordService } from './changepassword.service';

import { TokenService } from '../../../core/net/token.service';


/**
* 用户信息
*/
export interface interfaceUserInfo {
    //   姓名
    name: string;
    //   手机
    mobile: string;
    [key: string]: any;
}


@Component({
    selector: 'app-changepassword',
    templateUrl: './changepassword.component.html',
    styleUrls: ['./changepassword.component.less']
})
export class  ChangepasswordComponent implements OnInit {

    constructor(
        public _ChangepasswordeService: ChangepasswordService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    validateForm: FormGroup;

    view_data = {
        //
        userInfo: new Object() as interfaceUserInfo,
        //
        verifyCode:'',
        oldPassword:'',
        password:'',
        passwordToo:'',
        //
        code_time:-1,
        code_checked:true,


    }


    //   发送验证码
    private mobileSms(mobile: string) {
        this._ChangepasswordeService.getPasswordsms().subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '验证码发送成功');
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }


    //  发送验证码
    click_code() {
        if (this.validateForm.controls.mobile.valid) {
            //  
            this.view_data.code_time = 30;
            this.view_data.code_checked = false;
            let tmr = setInterval(() => {
                if (this.view_data.code_time < 0) {
                    this.view_data.code_checked = true;
                    clearInterval(tmr);
                } else {
                    this.view_data.code_time = this.view_data.code_time - 1;
                }
            }, 1000);
            //   发送验证码
            this.mobileSms(this.validateForm.get('mobile').value);
        } else {
            this.view_data.code_checked = false;
            this.validateForm.get('mobile').setErrors({ 'error': true, 'msg': '手机格式输入错误' });
        }
        return false;
    }






    //   修改密码提交
    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        if(this.validateForm.valid){
            this._ChangepasswordeService.postPassword(this.validateForm.get('oldPassword').value, this.validateForm.get('password').value, this.validateForm.get('verifyCode').value).subscribe((res) => {
                if (res.code === '0') {
                    this.notification.create('success', '成功', '修改密码成功');
                    this.validateForm.reset();
                } else {
                    this.notification.create('error', '失败', res.message);
                }
            });
        }
    }

    //   验证两次密码一至
    passwordEquar(control: FormControl) {
        if (!control || !control.parent) return null;
        if (control.value !== control.parent.get('password').value) {
            return { equar: true };
        }
        return null;
    }







    ngOnInit() {
        //
        this.view_data.userInfo = this._Injector.get(TokenService).userInfo;
        //
        this.validateForm = this.fb.group({
            mobile: [this.view_data.userInfo.mobile, [Validators.required]],
            verifyCode: [this.view_data.verifyCode, [Validators.required, Validators.pattern(/^\d{5}$/)]],
            oldPassword: [this.view_data.oldPassword, [Validators.required, Validators.pattern(/^[\S\s]{1,16}$/)]],
            password: [this.view_data.password, [Validators.required, Validators.pattern(/^[\S\s]{1,16}$/)]],
            passwordToo: [this.view_data.passwordToo, [Validators.required, this.passwordEquar]],
        });

        //

        
    }

}
