let processes = [];

function addProcess() {
    const pid = document.getElementById("pid").value;
    const arrival = parseInt(document.getElementById("arrival").value);
    const burst = parseInt(document.getElementById("burst").value);
    
    if (!pid || isNaN(arrival) || isNaN(burst)) {
        alert("Please fill all fields with valid values");
        return;
    }
    
    processes.push({ pid, arrival, burst });
    updateProcessList();
    
    // Auto-increment process ID
    const nextPid = "P" + (parseInt(pid.substring(1)) + 1);
    document.getElementById("pid").value = nextPid;
    document.getElementById("arrival").value = arrival + 1;
    document.getElementById("burst").value = Math.floor(Math.random() * 5) + 1;
}

function updateProcessList() {
    const listDiv = document.getElementById("process-list");
    listDiv.innerHTML = "<h3>Process Queue</h3>";
    
    if (processes.length === 0) {
        listDiv.innerHTML += "<p>No processes added</p>";
        return;
    }
    
    const ol = document.createElement("ol");
    processes.forEach(proc => {
        const li = document.createElement("li");
        li.textContent = `${proc.pid} (Arrival: ${proc.arrival}, Burst: ${proc.burst})`;
        ol.appendChild(li);
    });
    listDiv.appendChild(ol);
}

function calculateFCFS() {
    if (processes.length === 0) {
        alert("Please add at least one process");
        return;
    }
    
    // Sort by arrival time (FCFS)
    processes.sort((a, b) => a.arrival - b.arrival);
    
    // Calculate finish times and metrics
    let currentTime = 0;
    const ganttChart = document.getElementById("gantt-chart");
    const metricsTable = document.getElementById("metrics");
    ganttChart.innerHTML = "";
    
    // Clear existing metrics (keep header)
    while (metricsTable.rows.length > 1) {
        metricsTable.deleteRow(1);
    }
    
    let totalTurnaround = 0;
    let totalWaiting = 0;
    
    processes.forEach(proc => {
        // Handle idle time
        if (currentTime < proc.arrival) {
            const idleTime = proc.arrival - currentTime;
            const idleBlock = document.createElement("div");
            idleBlock.className = "gantt-block";
            idleBlock.style.backgroundColor = "#777";
            idleBlock.style.width = `${idleTime * 30}px`;
            idleBlock.textContent = `Idle (${idleTime})`;
            ganttChart.appendChild(idleBlock);
            currentTime = proc.arrival;
        }
        
        // Create process block
        const block = document.createElement("div");
        block.className = "gantt-block";
        block.style.backgroundColor = getRandomColor();
        block.style.width = `${proc.burst * 30}px`;
        block.textContent = `${proc.pid} (${proc.burst})`;
        ganttChart.appendChild(block);
        
        // Calculate metrics
        const finish = currentTime + proc.burst;
        const turnaround = finish - proc.arrival;
        const waiting = currentTime - proc.arrival;
        
        totalTurnaround += turnaround;
        totalWaiting += waiting;
        
        // Add to metrics table
        const row = metricsTable.insertRow();
        row.insertCell().textContent = proc.pid;
        row.insertCell().textContent = proc.arrival;
        row.insertCell().textContent = proc.burst;
        row.insertCell().textContent = finish;
        row.insertCell().textContent = turnaround;
        row.insertCell().textContent = waiting;
        
        currentTime = finish;
    });
    
    // Display averages
    const avgTurnaround = (totalTurnaround / processes.length).toFixed(2);
    const avgWaiting = (totalWaiting / processes.length).toFixed(2);
    
    document.getElementById("averages").innerHTML = `
        Average Turnaround Time: ${avgTurnaround}<br>
        Average Waiting Time: ${avgWaiting}
    `;
}

function reset() {
    processes = [];
    document.getElementById("process-list").innerHTML = "";
    document.getElementById("gantt-chart").innerHTML = "";
    document.getElementById("metrics").innerHTML = `
        <tr>
            <th>Process</th>
            <th>Arrival</th>
            <th>Burst</th>
            <th>Finish</th>
            <th>Turnaround</th>
            <th>Waiting</th>
        </tr>
    `;
    document.getElementById("averages").innerHTML = "";
    document.getElementById("pid").value = "P1";
    document.getElementById("arrival").value = "0";
    document.getElementById("burst").value = "3";
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}