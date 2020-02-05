package config

const (
	CLIENT_HEADER = "X-Client-Id"
)

type Config struct {
	Enabled      bool
	Database     string
	Port         string
	Username     string
	Password     string
	Host         string
	DatabaseName string
	Debug        bool
	DemoData     bool
}

func NewConfig() *Config {
	return &Config{
		Enabled:      true,
		Debug:        true,
		Database:     "cockroach",
		Port:         "26257",
		Username:     "root",
		Password:     "",
		Host:         "localhost",
		DatabaseName: "sanitary",
		DemoData:     false,
	}
}
