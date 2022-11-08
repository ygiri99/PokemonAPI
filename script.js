var dataArray = [];
let dataPerPage = 5,
  start,
  end;

//creating header
const header = document.createElement("header");
header.className =
  "d-flex justify-content-center bg-light align-items-center m-1";
//h1 tag
const h1 = document.createElement("h1");
h1.innerText = "pokemonAPI";
h1.className = "text-danger";
//Pokemon image
const imag = document.createElement("img");
imag.src = "https://assets.pokemon.com/static2/_ui/img/og-default-image.jpeg";
imag.alt = "pokemon image";
imag.classList.add("image");
const detail = document.createElement("b");
detail.className = "bg-warning";
detail.innerText = "Move the pointer over the image to see its details";

header.append(imag, h1, detail);
document.body.append(header); //appending header to body

//creating maindiv
const maindiv = document.createElement("div");
maindiv.className = "m-1";

//creating table
const table = document.createElement("table");
table.className = "table table-responsive table-bordered border-success";
table.id = "table";
//table head
const thead = document.createElement("thead");
thead.className = "bg-info";

//thead row creation
const tr = document.createElement("tr");
["Id", "Image", "Pokemon", "Ability1", "Ability2", "Hidden"].forEach(
  (theadname) => {
    const th = document.createElement("th");
    th.innerText = theadname;
    tr.appendChild(th);
  }
);
thead.appendChild(tr);
//tbody creation
const tbody = document.createElement("tbody");

//table maindiv append
table.append(thead, tbody);
maindiv.append(table);

//Feftching data from pokemon API
async function pokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=50");
    const data = await response.json();
    const totalData = data.results;
    dataArray = totalData;
    noOfPages = Math.ceil(dataArray.length / dataPerPage); //Getting number of pages
    function display(start, end) {
      tbody.innerText = "";
      totalData
        .slice(start, end)
        .sort(function (a, b) {
          return a - b;
        })
        .forEach((element) => {
          async function pokeele() {
            try {
              //fetching each result array url for each row
              const responsepop = await fetch(element.url);
              const datapop = await responsepop.json();

              //Mouse event fuction for Weight and Moves
              const event = () => {
                trbody.classList.add("backdrop");
                tdimg.appendChild(moves);
                pokeimage.classList.add("poke");
              };
              const eventout = () => {
                trbody.classList.remove("backdrop");
                tdimg.removeChild(moves);
                pokeimage.classList.remove("poke");
              };
              //creating tbody data
              const trbody = document.createElement("tr");
              const tdid = document.createElement("td");
              tdid.innerText = datapop.id;
              const tdname = document.createElement("td");
              tdname.innerText = datapop.name;
              const tdimg = document.createElement("td");
              const pokeimage = document.createElement("img");
              pokeimage.src = datapop.sprites.front_default;
              pokeimage.className = "img-fluid";
              pokeimage.alt = "poke image";
              const moves = document.createElement("span");
              //creating moves tag
              moves.classList.add("weight");
              var n = datapop.moves.length;
              if (n > 30) {
                n = 30; //30 moves only
              }

              moves.innerText = `Weight:${datapop.weight}\nMoves:`;
              for (var i = 0; i < n; i++) {
                moves.innerText += `${datapop.moves[i].move.name},`;
              }

              //Adding mouse event to image for weight and moves display
              pokeimage.addEventListener("mouseout", eventout);
              pokeimage.addEventListener("mouseover", event);
              //creating abilities
              const tdability1 = document.createElement("td");
              const tdability2 = document.createElement("td");
              const tdhidden = document.createElement("td");
              const abilitieslenght = datapop.abilities.length;
              if (abilitieslenght === 3) {
                tdability1.innerText = datapop.abilities[0].ability.name;
                tdability2.innerText = datapop.abilities[1].ability.name;
                tdhidden.innerText = datapop.abilities[2].ability.name;
              } else if (abilitieslenght === 2) {
                tdability1.innerText = datapop.abilities[0].ability.name;
                tdability2.innerText = "";
                tdhidden.innerText = datapop.abilities[1].ability.name;
              } else {
                tdability1.innerText = datapop.abilities[0].ability.name;
                tdability2.innerText = "";
                tdhidden.innerText = "";
              }
              tdimg.append(pokeimage); //display image
              //display table data
              trbody.append(
                tdid,
                tdimg,
                tdname,
                tdability1,
                tdability2,
                tdhidden
              );
              tbody.appendChild(trbody); //display table body
            } catch (err) {
              console.log(err);
            }
          }
          pokeele();
        });
    }
    //Initial display
    display(0, dataPerPage);

     //creating pagination
    //button Div
    const btnDiv = document.createElement("div");
    btnDiv.className = "d-flex justify-content-center m-1";

    //Pagination button creation
    const arr = [...Array(noOfPages).keys()].map((i) => {
      const noBtn = document.createElement("button");
      if (i === 0) noBtn.innerText = "First";
      else if (i === noOfPages - 1) noBtn.innerText = "Last";
      else noBtn.innerText = i + 1;
      noBtn.className = "btn btn-outline-primary m-1";

      //event for pagination buttons
      noBtn.addEventListener("click", () => {
        const abtn = document.querySelector(".active");
        if (abtn !== null) abtn.classList.remove("active");
        noBtn.classList.add("active");
        start = i * dataPerPage;
        end = start + dataPerPage;
        display(start, end);
      });
      return noBtn;
    });

    //appending buttons to btnDiv
    btnDiv.append(...arr);
    //maindiv.append();
    document.body.append(maindiv, btnDiv);
  } catch (err) {
    console.log(err);
  }
}
pokemon(); //Initial invoke
