package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.H;

public class MapH implements RowMapper<H> {

	@Override
	public H mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new H(
				rs.getTimestamp("hd"),
				rs.getString("op"),
				rs.getInt("rownr"),
                rs.getInt("id"),
                rs.getDate("d"),				
                rs.getBigDecimal("i"),
				rs.getInt("c"),
				rs.getInt("a"),
				rs.getBoolean("s"),
				rs.getString("g"),
				rs.getString("descr")
				);
	}
}
