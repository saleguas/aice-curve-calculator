// Declare all the mark schemes here

var rubrics = [
  new markRubric('Custom', [50, 40, 30, 20, 10, 5]),
  new markRubric('SX', [120, 85, 76, 65, 54, 44]),
]



setupPage();

// ////////////////////////////////////////////////////////////////////////
// Setting up the page on load
// ////////////////////////////////////////////////////////////////////////


function setupPage() {
  let optionLoc = $('#options');
  let optionMenu = createList();
  optionLoc.append(optionMenu);

  let markRowLoc = $('#markRow');
  setupMarkInput();
  updateFields();

  $('.markInput, #maxScale').on("input", function() {
    updateFields();
  });

}

function createList() {
  let optionMenu = document.createElement('SELECT');
  let value = 0;
  for (let rubric of rubrics) {
    let option = createOption(rubric.name, value);
    optionMenu.appendChild(option);
    value++;
  }
  return optionMenu;
}


function createOption(name, value) {
  let option = document.createElement('OPTION');
  option.text = name;
  option.value = value;
  return option;
}


function setupMarkInput() {
  let currentValue = $('#options').find(":selected").val();
  let currentMarks = rubrics[currentValue].marks;

  $('.markCol').each(function(index, value) {
    let markInput = document.createElement('input');
    markInput.value = currentMarks[index];
    markInput.className = 'inputUpdate markInput';
    $(this).html(markInput);
  });
}

// ////////////////////////////////////////////////////////////////////////
// End page setup
// ////////////////////////////////////////////////////////////////////////


// ////////////////////////////////////////////////////////////////////////
// Start dynamic grade updates
// ////////////////////////////////////////////////////////////////////////

function calculateNewCurves() {

  let curves = []

  $('.markInput').each(function(index, value) {
    let markVal = $(this).val();
    curves.push(markVal);
  });

  curves = curves.map(Number);
  let tempRubric = new markRubric('temp', curves);
  tempRubric.calculateCurves();

  let newMax = $('#maxScale').val();


  return tempRubric.getNewValues(newMax);
}

function setNewCurves(marks) {
  $('.scaleCol').each(function(index, value) {

    $(this).html(marks[index]);
  })
}

function updateFields() {
  let newPoints = calculateNewCurves();
  setNewCurves(newPoints);

  let curveField = $('#curvePercent');
  let oldMax = $('.markInput').first().val();
  let newMax = $('#maxScale').val();
  console.log(oldMax);
  console.log(newMax);
  curveField.html(newMax / oldMax * 100);


}

// Event handelers

$('#options').change(function() {
  setupMarkInput();
  updateFields();

  $('.markInput, #maxScale').on("input", function() {
    updateFields();
  });

});

// ////////////////////////////////////////////////////////////////////////
// End dynamic grade updates
// ////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////
// Begin table download
// ////////////////////////////////////////////////////////////////////////


function createTable() {

  let fileName = window.prompt('Enter the name of the file', 'New_aice_curves')
  let rows = [
    [fileName],
    ['Max Marks', 'A', 'B', 'C', 'D', 'E'],
    [],
    ['New Marks', 'New A', 'New B', 'New C', 'New D', 'New E'],
    [],
    []

  ]

  $('#markRow input').each(function(index, value) {
    rows[2].push($(this).val())
  });

  rows[4].push($('#curveRow input').val())

  $('#curveRow th').each(function(index, value) {
    rows[4].push($(this).text());
  });

  rows[4] = rows[4].filter(function(el) {
    return el != '';
  });

  let csvTable = rows.map(function(d) {
    return d.join(',');
  }).join('\n');

  var pom = document.createElement('a');
  var csvContent = csvTable; //here we load our csv data
  var blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;'
  });
  var url = URL.createObjectURL(blob);
  pom.href = url;
  pom.setAttribute('download', fileName + '.csv');
  pom.click();
}
// ////////////////////////////////////////////////////////////////////////
// End table download
// ////////////////////////////////////////////////////////////////////////
