import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

//  component
import { LeftnavComponent } from './leftnav/leftnav.component';
import { ModalResourcesComponent } from './modal/resources/resources.component';

//   server
import { VoteService } from './vote.service';

const COMPONENTS = [
    LeftnavComponent,
    ModalResourcesComponent,
];



@NgModule({
    imports: [SharedModule],
    providers: [
        VoteService,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class VoteModule { }
