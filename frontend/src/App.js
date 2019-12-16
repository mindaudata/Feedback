import React, {	useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import {
	Button,
	Container,
	TextField,
	Typography,
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const SERVER_ADDRESS = "http://localhost:3212/feedbacks";

const darkTheme = createMuiTheme({
	palette: {
	  type: 'dark',
	  primary: blue,
	},
  });

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: '#008bfd',
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	blueText: {
		color: '#008bfd'
	},
	list: {
		margin: theme.spacing(2),
	}
}));

function Loading() {
	return (
		<React.Fragment>
			<Typography	component="h4" variant="h4"	align="center">
				Connecting to server...
			</Typography>
			<CircularProgress align = "center" style={{margin: 20}}/>
		</React.Fragment>
	)
}

function Title() {
	return (
		<div style={{display:"flex", justifyContent: 'center'}}>
			<Typography variant="h3" display="inline">feed</Typography>
			<Avatar variant="square" style={{backgroundColor: '#008bfd', margin: 5}}>BA</Avatar>
			<Typography variant="h3" display="inline">ck</Typography>
		</div>
	)
}

export default function App() {
	const cleanForm = {
		name: '',
		email: '',
		comment: ''
	};
	const [form, setForm] = useState(cleanForm);
	const [isLoading, setIsLoading] = useState(true);
	const [feedbacks, setFeedbacks] = useState([]);
	const classes = useStyles();

	const getFeedbacks = async () => {
		await axios.get(SERVER_ADDRESS)
			.then(res => {
				const data = res.data.body;
				setFeedbacks(data);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		getFeedbacks()
	}, []);

	const handleChange = e => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const feedback = {
			...form,
			unixTimeStamp: new Date().getTime()
		};
		await axios.post(SERVER_ADDRESS, feedback);
		setFeedbacks([...feedbacks, feedback]);
		setForm(cleanForm);
	};

	return (
		<MuiThemeProvider theme={darkTheme}>
			<CssBaseline />
			<div className={classes.paper}>
				{ isLoading
					? <Loading/>
					: <Container component="main" maxWidth="xs">
						<Title/>
						<form onSubmit={handleSubmit} className={classes.form}>
							<TextField variant="outlined" margin="normal" required fullWidth type="name" label="Name" name="name" autoFocus	value={form.name} onChange={handleChange}/>
							<TextField variant="outlined" margin="normal" required fullWidth type="email" label="Email Address" name="email" autoComplete="email" value={form.email}	onChange={handleChange}/>
							<TextField variant="outlined" margin="normal" required fullWidth type="name" multiline rows="6" name="comment" label="Your thoughs about this solution" value={form.comment} onChange={handleChange}/>
							<Button	type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Send feedback</Button>
						</form>

						<List> 
							{feedbacks.sort((a, b) => b.unixTimeStamp - a.unixTimeStamp).map((feedback, index) =>
								<React.Fragment key={index}>
									<Divider variant="inset" component="li"/>
									<ListItem alignItems = "flex-start">
										<ListItemAvatar>
											<Avatar className={classes.avatar}>
												{feedback.name[0]}
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={<Typography component="span" variant="body2" className={classes.comment}>{feedback.name}</Typography>}
											secondary={
												<React.Fragment>
													<Typography	component="span" variant="body2" color="textPrimary">
														{new Date(feedback.unixTimeStamp).toISOString().slice(0, 16).replace(/-/g, "/").replace("T", " ")}
													</Typography>
													<Typography component="span" variant="body2">
														{' — ' + feedback.comment}
													</Typography>
												</React.Fragment>
											}
										/>
									</ListItem>
								</React.Fragment>
							)}
						</List>
					</Container>
				}
			</div>
		</MuiThemeProvider>
	)
}