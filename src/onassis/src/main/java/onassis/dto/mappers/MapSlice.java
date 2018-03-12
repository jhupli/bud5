package onassis.dto.mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import onassis.dto.Slice;

public class MapSlice implements RowMapper<Slice> {
	@Override
	public Slice mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new Slice(
				rs.getBigDecimal("sl"),
				rs.getInt("c"));
	}
}
