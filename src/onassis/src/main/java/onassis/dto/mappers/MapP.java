package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.P;

public class MapP implements RowMapper<P> {

	@Override
	public P mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new P(
				rs.getLong("id"),
				rs.getDate("dc"),
				rs.getDate("d"),
				rs.getBigDecimal("i"),
				rs.getInt("c"),
				rs.getInt("a"),
				rs.getBoolean("s"),
				rs.getString("g"),
				rs.getString("descr"),
				rs.getBoolean("l"));
	}
}
