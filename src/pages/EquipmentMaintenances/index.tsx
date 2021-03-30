/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import Header from '../../components/Header';

import { RoomsContainer, BackButton } from './styles';

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function TablePaginationActions(props: {
  count: any;
  page: any;
  rowsPerPage: any;
  onChangePage: any;
}) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleFirstPageButtonClick = (event: any) => {
    onChangePage(event, 0);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleBackButtonClick = (event: any) => {
    onChangePage(event, page - 1);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleNextButtonClick = (any: any) => {
    // eslint-disable-next-line no-restricted-globals
    onChangePage(event, page + 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleLastPageButtonClick = (event: any) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const columns = [
  { id: 'name', label: 'Manutenção', minWidth: 170 },
  { id: 'code', label: 'Responsável', minWidth: 100 },
  { id: 'description', label: 'Descrição', minWidth: 100 },
  { id: 'date', label: 'Data da Manutenção', minWidth: 100 },
  {
    id: 'action',
    label: 'Ação',
    minWidth: 170,
  },
];

const useStyles2 = makeStyles({
  table: {
    maxWidth: 800,
  },
  tableContainer: {
    overflowX: 'auto',
    width: 700,
    alignSelf: 'center',
  },
  editorButton: {
    fontSize: 14,
    padding: 4,
    backgroundColor: '#5ae6bc',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    transition: 'background 0.2',
    '&:hover': {
      backgroundColor: '#439179',
    },
  },
  createButton: {
    position: 'absolute',
    right: 40,
    top: 22,
    fontSize: 14,
    padding: 4,
    backgroundColor: '#ff9000',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
    transition: 'background 0.2',
    '&:hover': {
      backgroundColor: '#bd6e00',
    },
  },
});

interface Equipment {
  id: string;
  name: string;
  tombo: string;
}

interface IParams {
  id: string;
}

interface Maintenance {
  id: string;
  titleMaintenance: string;
  description: string;
  responsibleMaintenance: string;
  date: Date;
}

const Room: React.FC = () => {
  const { id } = useParams<IParams>();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, maintenances.length - page * rowsPerPage);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>,
  ) => {
    setPage(newPage);
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const USER_TOKEN = localStorage.getItem('@GoBarber:token');
  const AuthStr = 'Bearer '.concat(USER_TOKEN || '');

  useEffect(() => {
    api
      .get(`/equipments/equipment/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setEquipment(response.data);
      });
    api
      .get(`/maintenances/equipment/${id}`, {
        headers: { Authorization: AuthStr },
      })
      .then((response) => {
        setMaintenances(response.data);
      });
  }, []);

  return (
    <>
      <Header />
      <BackButton>
        <Link to="/dashboard">
          <FiArrowLeft size={40} />
          <span>voltar</span>
        </Link>
      </BackButton>
      <RoomsContainer>
        <div>
          <strong className="nameRoom">
            {equipment?.name} : #{equipment?.tombo}
          </strong>
        </div>
        <Link to={`/dashboard/maintenance/create/${equipment?.id}`}>
          <button className={classes.createButton} type="button">
            Add Manutenção
          </button>
        </Link>
      </RoomsContainer>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead style={{ backgroundColor: '#a3c6e6' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align="center">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? maintenances.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : maintenances
            ).map((maintenance) => (
              <TableRow key={maintenance.id}>
                <TableCell
                  component="th"
                  style={{ fontSize: 18, fontWeight: 'bold' }}
                  align="center"
                  scope="row"
                >
                  {maintenance.titleMaintenance}
                </TableCell>
                <TableCell style={{ width: 160, fontSize: 18 }} align="center">
                  {maintenance.responsibleMaintenance}
                </TableCell>
                <TableCell style={{ width: 160, fontSize: 18 }} align="center">
                  {maintenance.description}
                </TableCell>
                <TableCell style={{ width: 160, fontSize: 18 }} align="center">
                  {maintenance.date}
                </TableCell>
                <TableCell style={{ width: 160, fontSize: 18 }} align="center">
                  <Link
                    to={`/dashboard/equipment/maintenances/details/${maintenance.id}`}
                  >
                    <button className={classes.editorButton} type="button">
                      Ver Detalhes
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={maintenances.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default Room;
