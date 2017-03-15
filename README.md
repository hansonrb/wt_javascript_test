# React test task

There is no limit of time for performing this task, if you don't know some used here technologies - take your time to get acquainted. You can find helpful existing functionality examples (companies view) which show you how to use every technology, follow the pattern.

Test task for react/redux developer

Implement `add new company` feature:
- I should see on /companies page button `Add Company`
- When I click on `Add Company` button I should be redirected to /companies/new page
- On /companies/new page I should see text input and `Add` button
- On click new company should be created and user should be redirected to /companies page and see update list of companies synchronized with the server
- Make some basic styling just to make /companies/new page look ok
- running `flow` and `npm run eslint` should not return any error
- no tests for javascript, do controller tests in rails app

Will be a plus if you:
- All **implementation should be done with specific development approaches for organization data flow, code formatting, writing styles, components, containers, reducers, sagas. It's SUPER important for us to be sure that candidate can follow existing coding culture**. 
- Implement form with redux-form
- Add validation to prevent submitting empty or < 3 letters company name
- Use material-ui library
- Implement button on `/companies` page which will generate 100 random companies, stores them on the server and displays in the list
- These companies will have understandable words as the names
- make simple client side pagination for `/companies` page



### Deliver your work:
- fork these repositories (this is the rails part https://github.com/WatchTowerBenefits/wt_rails_test )
- make changes and push to your repository
- create pull requests (1 for rails repo, 1 for react repo)


### Use yarn for dependency management

https://yarnpkg.com/en/

```
npm install --global yarn
yarn
```

### Check with flow

https://flowtype.org/

```
yarn global add flow-bin
flow
```

### Check with eslint

`npm run eslint`
