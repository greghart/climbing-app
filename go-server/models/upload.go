package models

type Upload struct {
	ID           int    `json:"id"`
	Key          string `json:"key"`
	Directory    string `json:"directory"`
	Engine       string `json:"engine"`
	OriginalName string `json:"originalName"`
	FileSize     int    `json:"fileSize"`
	Sha1Hash     string `json:"sha1Hash"`
	UploadedAt   string `json:"uploadedAt"`
}

func (u Upload) IsZero() bool {
	return u.ID == 0 && u.Key == "" && u.Directory == "" && u.Engine == "" && u.OriginalName == "" && u.FileSize == 0 && u.Sha1Hash == "" && u.UploadedAt == ""
}
