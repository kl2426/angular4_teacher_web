import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ViewjobComponent } from './viewjob/viewjob.component';

//   server
import { ViewjobService } from './viewjob/viewjob.service';

const COMPONENTS = [
    ViewjobComponent,
];



@NgModule({
    imports: [SharedModule],
    providers: [
        ViewjobService,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class JobsModule { }
