package onassis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

//import net.sf.log4jdbc.sql.jdbcapi.DataSourceSpy;

@Configuration
public class AppConfig {
    @Autowired
    DataSourceProperties dataSourceProperties;

    @Value(value = "${buddb.jdbc.url}")
    String jdbcUrl;
    
    @Bean
    @ConfigurationProperties(prefix = DataSourceProperties.PREFIX)
    DataSource realDataSource() {
        DataSource dataSource = DataSourceBuilder
                .create(this.dataSourceProperties.getClassLoader())
                .url(jdbcUrl)
                .build();
        return dataSource;
    }

   /* @Bean
    @Primary
    DataSource dataSource() {
        return new DataSourceSpy(realDataSource());
    }*/
    
	@Bean
	public JdbcTemplate getJdbcTemplate() {
		return new JdbcTemplate(realDataSource());
	}
}