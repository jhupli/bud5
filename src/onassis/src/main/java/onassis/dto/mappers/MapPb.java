package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.Pb;

public class MapPb implements RowMapper<Pb> {

	@Override
	public Pb mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new Pb(
				rs.getLong("id"),
				rs.getDate("d"),
				rs.getBigDecimal("i"),
				rs.getInt("c"),
				rs.getInt("a"),
				rs.getBoolean("s"),
				rs.getString("g"),
				rs.getString("descr"),
				rs.getBoolean("l"),
				rs.getBigDecimal("b"));
	}
}
