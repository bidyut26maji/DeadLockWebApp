const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { spawn } = require('child_process');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));


// ...................................................... IndexPageStart .......................................................
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/ShopOption', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ShopOption.html'));
});

// ...................................................... IndexPageEnd .......................................................

// ...................................................... Login & SignUp Page ................................................
/*LoginPage & Route start .................................................*/
app.get('/Login', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'Login.html'));
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required!" });
  }

  const python = spawn("python", ["LoginCheak.py", email, password]);
  //const python = spawn("python3", ["LoginCheck.py", email, password]);


  python.stdout.on("data", (data) => {
    const output = data.toString().trim();
    console.log(`Python Output: ${output}`);
    if (output === "valid") {
      res.json({ message: "Login successful!", redirect: "/" });
    } else {
      res.status(400).json({ message: "Invalid credentials. Please go for SignUP...." });
    }
  });

  python.stderr.on("data", (data) => {
    console.error(`Python Error: ${data.toString()}`);
    res.status(500).json({ message: "Internal server error from Python script." });
  });

  python.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);
  });
});


/*LoginPage & Route start .................................................*/

/*SignUp Page & Route start................................................*/
app.get('/SignUP', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SignUP.html'));
});
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  const nameValid = /^[A-Za-z\s]+$/.test(name);
  const emailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  if (!nameValid) {
    return res.status(400).json({ message: "Invalid name format." });
  }

  if (!emailValid) {
    return res.status(400).json({ message: "Invalid Gmail address." });
  }

  const python = spawn("python", ["SignUP.py", name, email, password]);

  let outputText = "";

  python.stdout.on("data", (data) => {
    outputText += data.toString();
    console.log(`Python Output: ${outputText}`);
  });

  python.stderr.on("data", (data) => {
    console.error(`Python Error: ${data}`);
  });

  python.on("close", (code) => {
    console.log(`Python script exited with code ${code}`);

    if (code === 0 && outputText.includes("User added successfully")) {
      res.json({ message: "You are registered! Now you can login...", redirect: "/Login.html" });
    } else {
      res.status(500).json({ message: "Already used data OR you gave incorrect input." });
    }
  });
});
/*SignUp Page & Route end................................................*/





// ...................................................... Login & SignUp Page ................................................



// ....................................................... ProductTemplatesTtoT ..................................................
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt012 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/whitetshirt012', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'WhiteTshirt012.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt012 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt010 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/blacktshirt010', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlackTshirt010.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt010 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt017 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/blacktshirt017', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlackTshirt017.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt017 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt018 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/blacktshirt018', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlackTshirt018.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt017 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch003 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/classicwatch003', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ClassicWatch003.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch003 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch004 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/classicwatch004', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ClassicWatch004.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch004 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch007 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/classicwatch007', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ClassicWatch007.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch007 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch008 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/classicwatch008', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ClassicWatch008.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ClassicWatch008 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch001 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/digitalwatch001', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'DigitalWatch001.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch001 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch005 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/digitalwatch005', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'DigitalWatch005.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch005 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch011 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/digitalwatch011', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'DigitalWatch011.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DigitalWatch011 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt002 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt002', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt002.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt002 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt003 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt003', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt003.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt003 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt005 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt005', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt005.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt005 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt006 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt006', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt006.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt006 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt007 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt007', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt007.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt007 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt008 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt008', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt008.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt008 <<<<<<<<<<<<<<<<<<<<<<<<<<<8
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt009 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt009', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt009.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt009 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt013 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt013', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt013.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt013 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt014 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt014', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt014.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt014 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt015 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt015', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt015.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt015 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt019 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/redtshirt019', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RedTshirt019.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RedTshirt019 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch002 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/smartwatch002', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SmartWatch002.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch002 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch006 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/smartwatch006', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SmartWatch006.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch006 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch009 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/smartwatch009', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SmartWatch009.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch009 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch010 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/smartwatch010', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SmartWatch010.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SmartWatch010 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt004 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/whitetshirt004', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'WhiteTshirt004.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt004 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt012 <<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/whitetshirt012', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'WhiteTshirt012.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WhiteTshirt012 <<<<<<<<<<<<<<<<<<<<<<<<<<<

// Section Wise indivisual

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt016 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/blacktshirt016', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlackTshirt016.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt016 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlueTshirt001 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/bluetshirt001', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlueTshirt001.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlueTshirt001 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlueTshirt011 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/bluetshirt011', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlueTshirt011.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlueTshirt011 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt018 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/blacktshirt018', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'BlackTshirt018.html'));
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> BlackTshirt018 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Sunglass&Eye100.html <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/Sunglass&Eye100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'Sunglass&Eye100.html'));
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> Sunglass&Eye100.html <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>>> Active&Outdoor100.html <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/Active&Outdoor100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'Active&Outdoor100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>> Active&Outdoor100.html <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>> WinterWear100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/WinterWear100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'WinterWear100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>> WinterWear100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ExclusiveFootwear100 <<<<<<<<<<<<<<<<<<<<<
app.get('/ExclusiveFootwear100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'ExclusiveFootwear100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>> ExclusiveFootwear100 <<<<<<<<<<<<<<<<<<<<<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Jewelry100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/Jewelry100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'Jewelry100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>> Jewelry100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>> SportsCap100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/SportsCap100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SportsCap100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>> SportsCap100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> VarsiLeatherBag100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/VarsiLeatherBag100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'VarsiLeatherBag100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> VarsiLeatherBag100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> FitTwillShirtForWoman100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/FitTwillShirtForWoman100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'FitTwillShirtForWoman100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FitTwillShirtForWoman100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GrandAtlanticChukkaBoots100 <<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/GrandAtlanticChukkaBoots100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'GrandAtlanticChukkaBoots100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GrandAtlanticChukkaBoots100 <<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> WomensFaux-TrimShirt100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/WomensFaux-TrimShirt100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'WomensFaux-TrimShirt100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> WomensFaux-TrimShirt100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> SoftTouchInterlockPolo100 <<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/SoftTouchInterlockPolo100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'SoftTouchInterlockPolo100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> SoftTouchInterlockPolo100 <<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> CasmartSmartWatch100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/CasmartSmartWatch100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'CasmartSmartWatch100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> CasmartSmartWatch100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>> CasmartSmartGlass100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/CasmartSmartGlass100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'CasmartSmartGlass100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CasmartSmartGlass100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CottonShirtForMen100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/CottonShirtForMen100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'CottonShirtForMen100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CottonShirtForMen100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DoubleBreastedBlazer100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/DoubleBreastedBlazer100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'DoubleBreastedBlazer100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DoubleBreastedBlazer100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RibbedCottonBodysuits100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
app.get('/RibbedCottonBodysuits100', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', 'RibbedCottonBodysuits100.html'));
});


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> RibbedCottonBodysuits100 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// ....................................................... ProductTemplatesTtoT ..................................................



//////////////////////////////////// ................................................. ML Model .......................................... //////////////////////////////////////
app.post('/recommend', (req, res) => {
  const { price, ProductName, ProductType } = req.body;

  console.log("💡 ML Running with:", price, ProductName, ProductType);

  const pythonProcess = spawn('python', [
    'MLmodel.py',
    price.toString(),
    ProductName,
    ProductType
  ]);

  let result = '';
  let error = '';

  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    error += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (error) {
      console.error("❌ Python error:\n", error);
      return res.status(500).json({ error });
    }

    try {
      const recommendations = JSON.parse(result);
      console.log("🔍 Recommendations:", recommendations);
      res.json(recommendations);
    } catch (e) {
      console.error("❌ Failed to parse Python output:", e.message);
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });
});
//////////////////////////////////// ................................................. ML Model .......................................... //////////////////////////////////////

///////////////////////////////////// .................................. SM ......................................................................../////////////////////////////////////

const productSearchMap = {
  shirt: 'WomensFaux-TrimShirt100.html',
  tshirt: 'WomensFaux-TrimShirt100.html',
  bluetshirt001: 'BlueTshirt001.html',
  redtshirt007: 'RedTshirt007.html',
  sunglasseye100: 'Sunglass&Eye100.html',
  redtshirt : 'redtshirt007.html',
  blacktshirt : 'BlackTshirt010.html', 
  jewelry : 'Jewelry100.html', 

};

app.get('/search', (req, res) => {
  const query = req.query.q?.toLowerCase();

  if (!query) {
    return res.status(400).send('Search query missing.');
  }
  const matchedKey = Object.keys(productSearchMap).find(key => query.includes(key));

  if (matchedKey) {
    const file = productSearchMap[matchedKey];
    return res.sendFile(path.join(__dirname, 'templates', 'ProductTemplates', file));
  }

  res.status(404).send('No matching product found.');
});



///////////////////////////////////// .................................. SM ......................................................................../////////////////////////////////////










// ................................................... Default ...................................................
app.use((req, res) => {
  res.status(404).send('PageNotFoundError101.....');
});
// ................................................... Default ...................................................



app.listen(PORT, () => {
  console.log(`>>>Server running at : http://localhost:${PORT}`);
});
