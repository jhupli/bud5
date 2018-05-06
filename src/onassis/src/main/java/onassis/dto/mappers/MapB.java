package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.B;

public class MapB implements RowMapper<B> {

	@Override
	public B mapRow(ResultSet rs, int rowNum) throws SQLException {
		B result =
		new B(rs.getDate("d"),
				rs.getBigDecimal("b"),
				rs.getBigDecimal("i"),
				rs.getBigDecimal("e"),
				rs.getInt("a"));
		result.setSmallestb(rs.getBigDecimal("smallestb"));
		return result;
	}

}
