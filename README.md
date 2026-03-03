import sorting plugin

"scripts": {
"sortWholeProject": "node scripts/importSortWholeProject.js",
"sortSinglePage": "node scripts/importSortSinglePage.js"
},

Ya script package.json mai add karni hai (npm run sortWholeProject ya sortSinglePage)

sortWholeProject or sortSinglePage koi b aik file project mai use kar ka sorting kar sakty ho

scripts ka folder mai rakhni ha

module.css sorting plugin

1. npm install glob --save-dev

"scripts": {
"sortWholeProjectModuleCss": "node scripts/sortWholeProjectModuleCss.js",
"sortSinglePageModuleCss": "node scripts/sortSinglePageModuleCss.js"
},

Ya script package.json mai add karni hai (npm run sortWholeProjectModuleCss ya sortSinglePageModuleCss)

sortWholeProjectModuleCss or sortSinglePageModuleCss koi b aik file project mai use kar ka sorting kar sakty ho

scripts ka folder mai rakhni ha

Eslint Plugin

1. install Eslint extension

2. npm install eslint eslint-plugin-unused-imports @eslint/eslintrc --save-dev

ais file ka code eslint.config.mjs mai rakhna hai jo next js by defualt bana deta hai

"scripts": {
"lint": "eslint . --ext .js,.jsx --ignore-pattern '.next/**'",
"lint:fix": "eslint . --ext .js,.jsx --ignore-pattern '.next/**' --fix",
}

Ya script package.json mai add karni hai (npm run lint:fix)

ais sai warning show ho gi or extra chez jo import hai wo khtam ho jaiye gi

import sort + module css sort whole project (code scripts ka folder mai file hai)
npm install glob --save-dev

import sort + module css sort + code formaating whole project (code scripts ka folder mai file hai)
npm install --save-dev prettier
npm install glob --save-dev
