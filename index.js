
let url=`http://localhost:3000/tasks`;
document.addEventListener("DOMContentLoaded",function(){
    const limit=5;
    let currentPage=1;

    async function fetchTasks(){
        try{
            let response=await fetch(`http://localhost:3000/tasks`);

            let data= await response.json();
            displayTasks(paginateTasks(data));
            diplayPagination(data);
            
        }
        catch(error){
            console.log("error")
        }
    }
    function displayTasks(data){
        let container=document.getElementById("container");
        container.innerHTML="";
        data.forEach(ele=>{
            const priority=calculatePriority(ele.dueDate);
            container.innerHTML+=`<div class="task-card $ {priority.toLowerCase()} ">
            <h3>${ele.title}</h3>
            <p>${ele.description}</p>
            <p>${ele.status}</p>
            <p>${newDate(ele.dueDate).toLocalString()}</p>
            <p>${priority}</p>
            <button onclick="editTask(${ele.id})">Edit</button>
            <button onclick="deleteTask(${ele.id})">Delete</button>

            </div>`;
        });
    }
    function calculatePriority(dueDate){
        const present= new Date();
        const due=new Date(dueDate);
        const diff=(due-present)/(1000*60);
        if(diff<=2) return "High";
        if(diff<=3) return "Medium";
        return "Low";
    }
    async function addTask(event){
        const title= document.getElementById("title").value;
        const description=document.getElementById("description").value;
        const dueDate=document.getElementById("dueDate").value;
        const status=document.getElementById("status").value;
        const task={title,description,dueDate,status};

        try {
            await fetch(`http://localhost:3000/tasks`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(task)

            });
            fetchTasks();
        } catch (error) {
            console.log("error");
        }
    }
    async function editTask(id){
        const updatedTask={
            title:prompt("Enter New title"),
        description:prompt("Enter new description"),
        dueDate:prompt("Enter new date(yyyy-mm-dd)"),
        status:prompt("Enter new status(Open.In Progress,Closed)")
        };
        try {
            await fetch(`http://localhost:3000/tasks/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(task)

            });
            fetchTasks();
        } catch (error) {
            console.log("error");
        }
        
    }

    async function deleteTask(id){
        try{
        await fetch(`http://localhost:3000/tasks/${id}`,{
            method:"DELETE"
        });
    fetchTasks();
        }catch(error){
            console.log("error");
        }

    }
    function paginateTasks(data){
        const start=(cirrentPage-1)*limit;
        const end=start+limit;
        return fetchTasks.slice(start,end);
    }
    function displayPagination(data){
        const pageCount=Math.ceil(data.length/limit);
        const pcont=document.getElementById("pcont");
        pcont.innerHTML="";
        for(let i=1;i<=pageCount;i++){
            pcont.innerHTML+=<button onClick="ChangePage(${i}">${i}</button>;
        }
        
    }
    function changePage(page){
        currentPage=page;
        fetchTasks();
    }
    function filterTasks(data,criteria){
        return data.filter(task=>{
            return(criteria.status===''||task.status===criteria.status)&&(criteria.priority===''||calculatePriority(task.dueDate)===
        criteria.priority);
        })
    }
    
})