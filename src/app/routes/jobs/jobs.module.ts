import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ViewjobComponent } from './viewjob/viewjob.component';
import { DecoratejobComponent } from './decoratejob/decoratejob.component';

//   server
import { ViewjobService } from './viewjob/viewjob.service';
import { DecoratejobService } from './decoratejob/decoratejob.service';

//   module
import { VoteModule } from '../vote/vote.module';

const COMPONENTS = [
    ViewjobComponent,
    DecoratejobComponent,
];



@NgModule({
    imports: [SharedModule, VoteModule],
    providers: [
        ViewjobService,
        DecoratejobService,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class JobsModule { }
