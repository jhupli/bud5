package onassis;

//import org.apache.tomcat.jdbc.pool.DataSource;
import javax.sql.DataSource;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class DataSourceAspectLogger {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	public DataSource ds = null;

    @Before("execution(* onassis.services.*.*(..))")
    public void logBeforeConnection(JoinPoint jp) throws Throwable {
        logDataSourceInfos("Before", jp);
    }

    @After("execution(* onassis.services.*.*(..)) ")
    public void logAfterConnection(JoinPoint jp) throws Throwable {
        logDataSourceInfos("After", jp);
    }

    public void logDataSourceInfos(final String time, final JoinPoint jp) {
        final String method = String.format("%s:%s", jp.getTarget().getClass().getName(), jp.getSignature().getName());
        logger.info(String.format("%s %s: number of connections in use by the application (active): %d.", time, method, 
        		((org.apache.tomcat.jdbc.pool.DataSource)
        		ds).getNumActive()
        		));
        logger.info(String.format("%s %s: the number of established but idle connections: %d.", time, method,
        		((org.apache.tomcat.jdbc.pool.DataSource)
        		ds).getNumIdle()));
        logger.info(String.format("%s %s: number of threads waiting for a connection: %d.", time, method, 
        		((org.apache.tomcat.jdbc.pool.DataSource)
        		ds).getWaitCount()));
    }

}