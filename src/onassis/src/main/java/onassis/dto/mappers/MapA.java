package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.A;

public class MapA implements RowMapper<A> {

	@Override
	public A mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new A(
				rs.getLong("id"),
				rs.getString("descr"),
				rs.getBoolean("active"),
				rs.getString("color"),
				rs.getBoolean("credit"));
	}
}
