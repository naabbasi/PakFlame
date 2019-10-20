package config

type Config struct {
	Enabled      bool
	Database     string
	Port         string
	Username     string
	Password     string
	Host         string
	DatabaseName string
	Debug        bool
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
	}
}
