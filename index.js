let xmlhttp = new XMLHttpRequest();
let getHistory = new XMLHttpRequest();
let e;
let datasets = [];
let tem = "NovelCOVID-19 stats";
let graph = new Chart(document.getElementById("chart"), {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
        title: {
            display: true,
            fontFamily: "'Roboto', sans-serif",
            fontColor: 'black',
            fontSize: 25,
            text: "NovelCOVID-19 stats"
        },
        responsive: true
    }

});


let deathSet = {
    label: "Deaths",
    data: [],
    fill: false,
    borderColor: 'rgba(255, 0, 0, 0.5)',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
}
let caseSet = {
    label: "Cases",
    data: [],
    fill: false,
    borderColor: 'rgba(253, 114, 0, 0.5)',
    backgroundColor: 'rgba(253, 114, 0, 0.5)',
}
let recoverSet = {
    label: "Recovered",
    data: [],
    fill: false,
    borderColor: 'rgba(0, 255, 0, 0.5)',
    backgroundColor: 'rgba(0, 255, 0, 0.5)',
}





getHistory.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let tl = JSON.parse(this.responseText)['timeline'];
        console.log(this.responseText);

        caseSet['data'] = Object.values(tl['cases']);
        // caseSet['labels'] = Object.keys(tl['cases']);
        deathSet['data'] = Object.values(tl['deaths']);
        // deathSet['labels'] = Object.keys(tl['deaths']);
        recoverSet['data'] = Object.values(tl['recovered']);
        // recoverSet['labels'] = Object.keys(tl['recovered']);
        console.log("data got")
        // e = tl;
        graph.data.datasets = []
        datasets = []
        graph.data.labels = Object.keys(tl['cases']);
        graph.update()
        console.log("Graph updated")
    }
}

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // document.getElementById("countries").innerHTML += `<div class='c'>All</div>`
        let con = []
        JSON.parse(this.responseText).forEach((el) => {
            con.push(el['country'])
            // document.getElementById("countries").innerHTML += `<div class='c'>${el['country']}</div>`
        });
        con = con.filter((v, i, a) => a.indexOf(v) === i);
        for (i of con) {
            document.getElementById("countries").innerHTML += `<div class='c'>${i}</div>`
        }
        for (i of document.getElementsByClassName('c')) {
            i.onclick = (el) => {
                console.log(el['target'].innerHTML);
                getHistory.open("GET", `https://corona.lmao.ninja/v2/historical/${el['target'].innerHTML}`, true);
                graph.options.title.text = "NovelCOVID-19 stats " + `for ${el['target'].innerHTML}`
                // graph.update();
                getHistory.send();
            }
        }

    }
}

xmlhttp.open("GET", "https://corona.lmao.ninja/v2/historical", true);
xmlhttp.send()

document.getElementById("dead").onclick = function() {
    for (i of graph.data.datasets) {
        if (i.label === deathSet.label) {
            graph.data.datasets.splice(graph.data.datasets.indexOf(i), 1);
            graph.update();
            return
        }
    }
    graph.data.datasets.push(deathSet);
    graph.update();
}

document.getElementById("case").onclick = function() {
    for (i of graph.data.datasets) {
        if (i.label === caseSet.label) {
            graph.data.datasets.splice(graph.data.datasets.indexOf(i), 1);
            graph.update();
            return
        }
    }
    graph.data.datasets.push(caseSet);
    graph.update();
}


document.getElementById("recover").onclick = function() {
    for (i of graph.data.datasets) {
        if (i.label === recoverSet.label) {
            graph.data.datasets.splice(graph.data.datasets.indexOf(i), 1);
            graph.update();
            return
        }
    }
    graph.data.datasets.push(recoverSet);
    graph.update();
}


document.getElementById("reset").onclick = function() {
    graph.data.datasets = [];
    graph.update();
}

document.getElementById("cummu").onclick = function() {
    for (i of graph.data.datasets) {
        i.data = i.data.map((el, ind, arr) => {
            if (ind === 0) return el;
            else return el - arr[ind - 1];
        })
    }
    graph.update();
}
