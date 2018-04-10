import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { HeaderComponent } from './default/header/header.component';
import { FooterComponent } from './default/footer/footer.component';

//   server
import { LayoutService } from './layout.service';

const COMPONENTS = [
    LayoutDefaultComponent,
    HeaderComponent,
    FooterComponent,
];



@NgModule({
    imports: [SharedModule],
    providers: [
        LayoutService,
    ],
    declarations: [
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ]
})
export class LayoutModule { }
