import React from 'react'
class App extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			isLoading: true,
			blogData: []
		}
	}
  
	componentWillMount() {
		localStorage.getItem('blogData') && this.setState({
			blogData: JSON.parse(localStorage.getItem('blogData')),
			isLoading: false
		})
	}  

	componentDidMount(){
		const date = localStorage.getItem('blogDataDate');
		const blogDataDate = date && new Date(parseInt(date));
		const now = new Date();

		const dataAge = Math.round((now - blogDataDate) / (1000 * 60)); // in minutes
		const tooOld = dataAge >= 1;

		if(tooOld){
			this.fetchData();            
		} else {
			console.log(`Using data from localStorage that are ${dataAge} minutes old.`);
		}
	}	

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('blogData', JSON.stringify(nextState.blogData));
		localStorage.setItem('blogDataDate', Date.now());
	}
	
	fetchData(){

		this.setState({
			isLoading: true,
			blogData: []
		})

		fetch('http://reduxblog.herokuapp.com/api/posts')
		.then(response => response.json())
		//.then(json => console.log(json))
		.then(parsedJSON => parsedJSON.map(blogs => (
			{
				id: `${blogs.id}`,
				title: `${blogs.title}`
			}
		)))
		.then(blogData => this.setState({
			blogData,
			isLoading: false
		}))
		.catch(error => console.log('parsing failed', error))
      
	}
	
	handleEditClick(e) {
		if (e.currentTarget.dataset.id !== null) {
			var blogId = e.currentTarget.dataset.id;
			console.log("ggg="+blogId);
		}

	}
	
	
  
	handleClick(e) {
		
		if (e.currentTarget.dataset.id !== null) {
			document.getElementById("addBlogForm").style.display = "none";
			
			var blogId = e.currentTarget.dataset.id;
			//alert(blogId);
			var url = 'http://reduxblog.herokuapp.com/api/posts/' + blogId;
			//alert(url);
			var req = new Request(url);
			
			
			
			fetch(req)
			.then(response => response.json())
			.then(function(responseObj) {
				
				document.getElementById('singleBlogDataView').innerHTML="";
				var bDataHtml = "<h3 class='rightHeader'>"+responseObj.title+"</h3><div class='row'><div class='col-3 pad0'><h3>Title</h3></div><div class='col-9 pad0'><h3>"+responseObj.title+"</h3></div><div class='col-3 pad0'><h3>Category</h3></div><div class='col-9 pad0'><h3>"+responseObj.categories+"</h3></div><div class='col-3 pad0'><h3>Content</h3></div><div class='col-9 pad0'><h3>"+responseObj.content+"</h3></div><button class='btn bEditBtn' data-id='"+responseObj.id+"' onClick='{this.handleEditClick = this.handleEditClick.bind(this)}'>EDIT</button><button class='btn bDeleteBtn' data-id='"+responseObj.id+"' onClick='{this.handleDeleteClick = this.handleDeleteClick.bind(this)}'>DELETE</button></div>";
				//document.getElementById('singleBlogDataView').insertAdjacentHTML('beforeend', bDataHtml));
				document.getElementById('singleBlogDataView').innerHTML=bDataHtml;
				
				//var para = document.createElement("div");
				//var node = document.createTextNode("This is new.");
				//para.appendChild(bDataHtml);

				//var element = document.getElementById("singleBlogDataView");
				//element.appendChild(bDataHtml);
				
				//document.getElementByClassName("bEditBtn").addEventListener("click", {this.handleEditClick = this.handleEditClick.bind(this)});
				//document.getElementByClassName("bEditBtn").onclick = handleEditClick(this);
				//var resObj = {};
				//resObj = responseObj;
				// console.log(resObj);
				//var blogViewData = [];
				// "save it to a variable"
				//blogViewData.push(resObj)
				//console.log(blogViewData);
				//alert(blogViewData);
				
			})
			
			.catch(error => console.log('parsing failed', error))
		
		}
	}
	
	handleBlogAdd(){
		document.getElementById('singleBlogDataView').innerHTML="";
		document.getElementById("addBlogForm").style.display = "block";		
	}
	
	handleBlogAddPost(){
		var inputTitle = this.refs.myInputTitle.value;
		if (inputTitle === null || inputTitle === "") {
			alert("Enter Title");
			return false;
		}
		var inputCategory = this.refs.myInputCategory.value;
		if (inputCategory === null || inputCategory === "") {
			alert("Enter Category");
			return false;
		}
		var inputContent = this.refs.myInputContent.value;
		if (inputContent === null || inputContent === "") {
			alert("Enter Content");
			return false;
		}
		var addBlogData = {title:inputTitle,categories:inputCategory,content:inputContent};
		console.log(addBlogData);
		var urlpost = 'http://reduxblog.herokuapp.com/api/posts/';
		//alert(url);
		var addUrl = new Request(urlpost);
		fetch(addUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(addBlogData)
		})
		//.then(response => console.log(response.json()))
		.then(document.getElementById("addBlogForm").style.display = "none")
		.then(this.fetchData())
		//.then(window.location.reload())
	}

	render() {
		const {isLoading, blogData} = this.state;
		return (
			<div>
				<header className="blogHeader"><h1 className="blogHeaderH1">Redux Blog<button className="btn rightAlign" onClick={this.handleBlogAdd}>ADD NEW BLOG</button></h1></header>
				
				<div className="row marg0">
					<div className="col-3 pad0">
						
						<ul>
						
						{
							!isLoading && blogData.length > 0 ? blogData.map(blog => {
								const {id, title} = blog;
								return <li key={id} data-id={id} onClick={this.handleClick = this.handleClick.bind(this)}>{title}</li>
							}) : null
						}
						</ul>
					</div>
				
					<div className="col-9">
						<div id="singleBlogDataView"></div>
						
						<div id="addBlogForm" className="hiddenBlogAdd">
								<h3 className="rightHeader">Add New</h3>
								<div className="row">
									<div className="col-3 pad0">
										<h3>Title</h3>
									</div>
									<div className="col-9 pad0">
										<input type="text" placeholder="Enter title" ref="myInputTitle" />
									</div>
								</div>
								<div className="row">
									<div className="col-3 pad0">
										<h3>Category</h3>
									</div>
									<div className="col-9 pad0">
										<input type="text" placeholder="Enter category" ref="myInputCategory" />
									</div>
								</div>
								<div className="row">
									<div className="col-3 pad0">
										<h3>Content</h3>
									</div>
									<div className="col-9 pad0">
										<textarea placeholder="Enter content" ref="myInputContent"></textarea>
									</div>
								</div>
								<button className="btn" onClick={(e) => {this.handleBlogAddPost();}}>SAVE</button>
						</div>
					</div>
					
				</div>
			</div>
		);
	}
}
export default App;