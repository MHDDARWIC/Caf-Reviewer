const cafeList=document.querySelector('#cafe-list'); // get a reference for the list in html file
const form=document.querySelector('#add-cafe-form'); // get a reference for the form in the html file

//create element and render cafe
function renderCafe(doc){
    let li=document.createElement('li');
    let name=document.createElement('span');
    let city=document.createElement('span');
    let cross=document.createElement('div');

    li.setAttribute('data-id',doc.id);
    name.textContent=doc.data().name;
    city.textContent=doc.data().city;
    cross.textContent='X';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    //Deleting Data (Deleting)
    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id=e.target.parentElement.getAttribute('data-id'); //get the id of the document
        db.collection('Cafes').doc(id).delete();
    })

}

//Getting Data (Reading) (NOT REAL TIME )
/*db.collection('Cafes').orderBy('name').get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{ // cycle through each document in the collection
        renderCafe(doc);  //call this function each time
    })

});*/ // get a reference to Cafes collection and grab all the documents

//Saving Data (Writing)
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    db.collection('Cafes').add({
        name:form.name.value,
        city:form.city.value
    })
    form.name.value='';
    form.city.value='';
});

//Real time listner (getting data)
db.collection('Cafes').orderBy('city').onSnapshot(snapshot=>{
    let changes=snapshot.docChanges();
    changes.forEach(change => {
        if(change.type=='added'){
            renderCafe(change.doc);
        }
        else if(change.type=='removed'){
            let li=cafeList.querySelector('[data-id='+change.doc.id+']');
            cafeList.removeChild(li);
        }
    });
  

});