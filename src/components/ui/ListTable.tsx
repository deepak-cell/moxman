"use client";

import {
  Box,
  Checkbox,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useMemo, useState } from "react";
import CtaButton from "@/components/ui/CtaButton";

export type TableColumn<T> = {
  id: keyof T;
  label: string;
  sortable?: boolean;
  minWidth?: number;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
};

type SortOrder = "asc" | "desc";

type ListTableProps<T extends { id: string }> = {
  title: string;
  subtitle?: string;
  rows: T[];
  columns: TableColumn<T>[];
  addLabel?: string;
  addRequiresSelection?: boolean;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onBulkDelete?: (rows: T[]) => void;
  rowsPerPageOptions?: number[];
  searchPlaceholder?: string;
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ListTable<T extends { id: string }>({
  title,
  subtitle,
  rows,
  columns,
  addLabel = "Add",
  addRequiresSelection = false,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  rowsPerPageOptions = [5, 10, 25],
  searchPlaceholder = "Search",
}: ListTableProps<T>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[1] ?? 10);
  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0]?.id ?? ("id" as keyof T));
  const [order, setOrder] = useState<SortOrder>("asc");

  const filteredRows = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((row) =>
      Object.values(row).some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [rows, debouncedSearch]);

  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows];
    sorted.sort((a, b) => {
      const valueA = a[orderBy];
      const valueB = b[orderBy];
      if (valueA === valueB) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;
      const comparison = String(valueA).localeCompare(String(valueB));
      return order === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [filteredRows, orderBy, order]);

  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelected(pagedRows.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleRowSelect = (rowId: string) => {
    setSelected((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId],
    );
  };

  const isSelected = (rowId: string) => selected.includes(rowId);
  const selectedRows = rows.filter((row) => selected.includes(row.id));
  const isAddDisabled = addRequiresSelection && selected.length === 0;

  return (
    <Box>
      <Toolbar
        sx={{
          p: 0,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              width: { xs: "100%", sm: 320, md: 420 },
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "12px",
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small">
            <Select
              value={rowsPerPage}
              onChange={(event) => {
                setRowsPerPage(Number(event.target.value));
                setPage(0);
              }}
            >
              {rowsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  Show {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selected.length > 0 && (
            <CtaButton
              variant="red"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={() => onBulkDelete?.(selectedRows)}
            >
              Delete Selected
            </CtaButton>
          )}
          {onAdd && (
            <CtaButton variant="role" onClick={onAdd} disabled={isAddDisabled}>
              {addLabel}
            </CtaButton>
          )}
        </Box>
      </Toolbar>

      <TableContainer sx={{ border: "1px solid rgba(0,0,0,0.06)", borderRadius: "0.688rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < pagedRows.length}
                  checked={pagedRows.length > 0 && selected.length === pagedRows.length}
                  onChange={(event) => handleSelectAll(event.target.checked)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align ?? "left"}
                  sx={{ minWidth: column.minWidth }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => {
                        const isAsc = orderBy === column.id && order === "asc";
                        setOrder(isAsc ? "desc" : "asc");
                        setOrderBy(column.id);
                      }}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {(onEdit || onDelete) && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.map((row) => (
              <TableRow key={row.id} hover selected={isSelected(row.id)}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={String(column.id)} align={column.align ?? "left"}>
                    {column.render ? column.render(row) : String(row[column.id])}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {onEdit && (
                      <CtaButton
                        variant="outlined"
                        size="small"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                        onClick={() => onEdit(row)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </CtaButton>
                    )}
                    {onDelete && (
                      <CtaButton
                        variant="red"
                        size="small"
                        startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                        onClick={() => onDelete(row)}
                      >
                        Delete
                      </CtaButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={sortedRows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(Number(event.target.value));
          setPage(0);
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
