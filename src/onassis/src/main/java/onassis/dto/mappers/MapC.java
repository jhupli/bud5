package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.C;

public class MapC implements RowMapper<C> {

	@Override
	public C mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new C(
				rs.getLong("id"),
				rs.getBigDecimal("i"),
				rs.getString("descr"),
				rs.getBoolean("active"),
				rs.getString("color"));
	}
}
