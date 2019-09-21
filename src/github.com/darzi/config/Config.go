package config

type Config struct {
	Enabled      bool
	Database     string
	Port         string
	Username     string
	Password     string
	Host         string
	DatabaseName string
}

func NewConfig() *Config {
	return &Config{
		Enabled:      true,
		Database:     "cockroach",
		Port:         "26257",
		Username:     "root",
		Password:     "",
		Host:         "localhost",
		DatabaseName: "darzi",
	}
}
