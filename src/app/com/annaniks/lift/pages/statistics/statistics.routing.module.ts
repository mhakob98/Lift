
// Angular Core Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Components
import { StatisticsComponent } from './statistics.component';

let statisticsRoutes: Routes = [
    {
        path: '', component: StatisticsComponent, children: [
            { path: '', redirectTo: '/statistics/preview', pathMatch: 'full' },
            {
                path: 'preview',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/preview/preview.module')
                    .then(m => m.PreviewModule)
            },
            {
                path: 'subscribers',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/subscribers/subscribers.module')
                    .then(m => m.SubscribersModule)
            },
            {
                path: 'my-subscribes',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/my-subscribes/my-subscribes.module')
                    .then(m => m.MySubscribersModule)
            },
            {
                path: 'posts',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/posts/posts.module')
                    .then(m => m.PostsModule)
            },
            {
                path: 'likes',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/likes/likes.module')
                    .then(m => m.LikesModule)
            },
            {
                path: 'comments',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/comments/comments.module')
                    .then(m => m.CommentsModule)
            },
            {
                path: 'bookmarks',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/bookmarks/bookmarks.module')
                    .then(m => m.BookmarksModule)
            }

        ]
    }
]
@NgModule({
    imports: [RouterModule.forChild(statisticsRoutes)],
    exports: [RouterModule]
})
export class StatisticsRoutingModule {
    static components = [StatisticsComponent]
}

