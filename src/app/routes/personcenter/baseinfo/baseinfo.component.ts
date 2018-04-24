import { Component, OnInit, Injector } from '@angular/core';
import { NzNotificationService, NzModalService, NzMessageService, UploadFile  } from 'ng-zorro-antd';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

import { BaseinfoService } from './baseinfo.service';

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


declare let Cropper;

@Component({
    selector: 'app-baseinfo',
    templateUrl: './baseinfo.component.html',
    styleUrls: ['./baseinfo.component.less']
})
export class  BaseinfoComponent implements OnInit {

    constructor(
        public _BaseinfoService: BaseinfoService,
        private notification: NzNotificationService,
        public _Injector: Injector,
        private fb: FormBuilder,
        private message: NzMessageService,
    ) { }

    validateForm: FormGroup;
    //  修改密码显示
    step = 'show';
    //   修改头像显示
    step_baseinfo = 'user';
    //  图片裁剪
    cropper = null;

    view_data = {
        //
        userInfo: new Object() as interfaceUserInfo,
        //   name
        name:'',
        //
        address:'',
        //  form
        form:{
            mobile:'',
            code:'',
        },
        //   上传头像文件
        fileList:[],
        img_base64:'',
        //   默认头像放大倍数
        sliderValue:7,
        nzMin:0,
        nzMax:10,
        //   验证码倒计时
        code_time:-1,
        code_checked:true,

    }

    //   手机号码查重
    private mobiledUp(mobile:string) {
        this._BaseinfoService.getMobiledUp(mobile).subscribe((res) => {
            if(res.code === '0'){
                this.view_data.code_checked = true;
                this.validateForm.get('mobile').setErrors(null);
            }else{
                this.view_data.code_checked = false;
                this.validateForm.get('mobile').setErrors({'error':true,'msg':res.message});
            }
        });
    }

    //   发送验证码
    private mobileSms(mobile: string) {
        this._BaseinfoService.getMobilesms(mobile).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '验证码发送成功');
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }
    


    //  blur
    mobileBlur(){
        if(/^1\d{10}$/.test(this.validateForm.get('mobile').value)){
            this.mobiledUp(this.validateForm.value.mobile);
        }else{
            this.view_data.code_checked = false;
            this.validateForm.controls.mobile.setErrors({ 'error': true, 'msg': '手机格式输入错误' });
        }
    }

    //  发送验证码
    click_code(){
        if (this.validateForm.controls.mobile.valid) {
            //  
            this.view_data.code_time = 30;
            this.view_data.code_checked = false;
            let tmr = setInterval(() => {
                if(this.view_data.code_time < 0){
                    this.view_data.code_checked = true;
                    clearInterval(tmr);
                }else{
                    this.view_data.code_time = this.view_data.code_time - 1;
                }
            },1000);
            //   发送验证码
            this.mobileSms(this.validateForm.get('mobile').value);
        }else{
            this.view_data.code_checked = false;
            this.validateForm.get('mobile').setErrors({ 'error': true, 'msg': '手机格式输入错误' });
        }
        return false;
    }


    //   修改手机号码
    editMobile(){
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        if(!this.validateForm.valid){return false;}
        //
        this._BaseinfoService.postMobile(this.validateForm.get('mobile').value, this.validateForm.get('code').value).subscribe((res) => {
            if (res.code === '0') {
                this.notification.create('success', '成功', '手机号码修改成功');
                this.step = 'show';
                this.view_data.userInfo.mobile = this.validateForm.get('mobile').value;
                this._Injector.get(TokenService).userInfo = this.view_data.userInfo;
            } else {
                this.notification.create('error', '失败', res.message);
            }
        });
    }







    //    
    click_info(){
        //   显示修改头像
        this.step_baseinfo = 'header';
        this.cropper && this.cropper.destroy();
        setTimeout(() => {
            let image = document.getElementById('baseinfo_image');
            this.cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                autoCropArea:1,
                crop: (event) => {
                    this.view_data.img_base64 = this.cropper.getCroppedCanvas().toDataURL();
                }
            });
        }, 1);
    }





    //   上传图片按钮点击
    beforeUpload = (file: UploadFile): boolean => {
        this.view_data.fileList = [file];
        const URL = window.URL;
        let temp_url = URL.createObjectURL(file);
        this.cropper.replace(temp_url);
        this.view_data.sliderValue = 7;
        this.click_zoom(this.view_data.sliderValue);
        return false;
    }

    //   上传图片
    click_upheader(){
        this.cropper.getCroppedCanvas().toBlob((blob) => {
            var formData = new FormData();
            formData.append('file', blob, new Date().getTime() + '.png');
            console.log(blob);
            this._BaseinfoService.postUserHeader(formData).subscribe((res) => {
                if (res.code === '0') {
                    this.notification.create('success', '成功', '上传头像成功');
                    this.step_baseinfo = 'user';
                    this.validateForm.get('mobile').setValue('');
                    this.validateForm.get('code').setValue('');
                    this.view_data.userInfo.profilePhoto = res.data;
                    this._Injector.get(TokenService).userInfo = this.view_data.userInfo;
                } else {
                    this.notification.create('error', '失败', res.message);
                }
            })
        });
    }

    /**
     * 头像放大/缩小
     * @param i 值
     * @param s 模式 less 减， sum加
     */
    click_zoom(i:any){
        console.log(i);
        if(i < this.view_data.nzMin || i > this.view_data.nzMax){return false;}
        this.view_data.sliderValue = i;
        this.cropper.zoomTo(this.view_data.sliderValue * 0.1);
    }





    ngOnInit() {
        //
        this.view_data.userInfo = this._Injector.get(TokenService).userInfo;
        this.view_data.name = this.view_data.userInfo.name;
        this.view_data.form.mobile = this.view_data.userInfo.mobile;
        //
        this.validateForm = this.fb.group({
            mobile: [''],
            code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        });

        //

        
    }

}
