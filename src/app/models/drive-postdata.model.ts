export interface DriveRequestModel {
    valueInputOption: string;
    data: PostDataModel[]

}

export interface PostDataModel {
    range: string;
    majorDimension: string;
    values: any[]
}