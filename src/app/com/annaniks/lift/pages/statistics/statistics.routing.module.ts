
// Angular Core Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Components
import { StatisticsComponent } from './STATISTICS.component';

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
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'subscribers' }
            },
            {
                path: 'my-subscribes',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'my-subscribes' }
            },
            {
                path: 'posts',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'posts' }
            },
            {
                path: 'likes',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/likes-comments-bookmarks/likes-comments-bookmarks.module')
                    .then(m => m.LikesCommentsBookmarksModule),
                data: { type: 'likes' }

            },
            {
                path: 'comments',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/likes-comments-bookmarks/likes-comments-bookmarks.module')
                    .then(m => m.LikesCommentsBookmarksModule),
                data: { type: 'comments' }

            },
            {
                path: 'bookmarks',
                loadChildren: () => import('src/app/com/annaniks/lift/pages/statistics/likes-comments-bookmarks/likes-comments-bookmarks.module')
                    .then(m => m.LikesCommentsBookmarksModule),
                data: { type: 'bookmarks' }

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

