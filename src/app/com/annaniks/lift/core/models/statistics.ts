export class StatisticsData {
    accountId: number;
    startDate: string | Date;
    endDate: string | Date;
}

export class Statistic {
    followers: number;
    followings: number;
    postsCount: number;
    year: number;
    date: string;
    mouth: number;
    day: number;
}

export interface LikesCommentsStatistic {
    comment: number;
    like: number;
    year: number;
    mouth: number;
    day: number;
    date: string;
}

export interface PostStatistic {
    caption: string;
    comment: number;
    deltaComment: number;
    deltaLike: number;
    like: number;
    owner: string;
    shortcode: string;
    thumbnail: string;
    taken_at_timestamp: string;
}

export interface StatisticValue {
    value: number;
    todayCount: number;
}

export interface LineChartData {
    data: number[];
    label: string;
    borderColor?: string;
    pointRadius?: number;
    fill?: boolean;
    backgroundColor?: string;
}