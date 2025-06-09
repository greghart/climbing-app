package models

type Upload struct {
	ID           int64  `json:"id" sqlp:"id"`
	Key          string `json:"key" sqlp:"key"`
	Directory    string `json:"directory" sqlp:"directory"`
	Engine       string `json:"engine" sqlp:"engine"`
	OriginalName string `json:"originalName" sqlp:"originalName"`
	FileSize     int    `json:"fileSize" sqlp:"fileSize"`
	Sha1Hash     string `json:"sha1Hash" sqlp:"sha1Hash"`
	UploadedAt   string `json:"uploadedAt" sqlp:"uploadedAt"`
}

func (u Upload) IsZero() bool {
	return u.ID == 0 &&
		u.Key == "" &&
		u.Directory == "" &&
		u.Engine == "" &&
		u.OriginalName == "" &&
		u.FileSize == 0 &&
		u.Sha1Hash == "" &&
		u.UploadedAt == ""
}
