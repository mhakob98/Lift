
// Angular Core Modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Our Components
import { StatisticsComponent } from './STATISTICS.component';

const statisticsRoutes: Routes = [
    {
        path: '', component: StatisticsComponent, children: [
            { path: '', redirectTo: '/statistics/preview', pathMatch: 'full' },
            {
                path: 'preview',
                loadChildren: () => import('./preview/preview.module')
                    .then(m => m.PreviewModule)
            },
            {
                path: 'subscribers',
                loadChildren: () => import('./subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'subscribers' }
            },
            {
                path: 'my-subscribes',
                loadChildren: () => import('./subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'my-subscribes' }
            },
            {
                path: 'posts',
                loadChildren: () => import('./subscribes-posts/subscribes-posts.module')
                    .then(m => m.SubscribesPostsModule),
                data: { type: 'posts' }
            },
            {
                path: 'likes',
                loadChildren: () => import('./likes-comments-bookmarks/likes-comments-bookmarks.module')
                    .then(m => m.LikesCommentsBookmarksModule),
                data: { type: 'likes' }

            },
            {
                path: 'comments',
                loadChildren: () => import('./likes-comments-bookmarks/likes-comments-bookmarks.module')
                    .then(m => m.LikesCommentsBookmarksModule),
                data: { type: 'comments' }

            },
            {
                path: 'bookmarks',
                loadChildren: () => import('./likes-comments-bookmarks/likes-comments-bookmarks.module')
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

