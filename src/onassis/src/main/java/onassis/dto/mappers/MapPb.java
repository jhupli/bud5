package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.P;
import onassis.dto.Pb;

public class MapPb implements RowMapper<P> {

	@Override
	public P mapRow(ResultSet rs, int rowNum) throws SQLException {
		return (P) new Pb(
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
