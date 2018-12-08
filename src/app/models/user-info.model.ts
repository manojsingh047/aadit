export class UserInfoModel {
    constructor(public token: TokenModel, public profile: UserProfileModel) { }
}

export class UserProfileModel {
    constructor(public email: string, public lastName?: string, public firstName?: string, public fullName?: string, public picture?: string) { }
}

export class TokenModel {
    constructor(public oAuthToken: string, public refreshToken: string, public sheetId: string) { }
}