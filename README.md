# React test task

There is no limit of time for performing this task.  If you don't know some used here technologies - take your time to get acquainted. You can find helpful existing functionality examples (companies view) which show you how to use every technology.  Follow the pattern.

### Test task requirements for react/redux developer: ###

Implement `add new company` feature:
- On the `/companies` page, I should see a button labeled `Add Company`
- When I click on the `Add Company` button I should be redirected to `/companies/new` page
- On the `/companies/new` page, I should see a text input and an `Add` button
- On click, a new company should be created and user should be redirected to `/companies` page and see update list of companies synchronized with the server
- Make some basic styling just to make `/companies/new` page look ok
- Running `flow` and `npm run eslint` should not return any error
- This task does not require tests to be written for the javascript. Please create controller tests in the associated rails app.

---

**All implementation should be done with specific development approaches for organization data flow, code formatting, writing styles, components, containers, reducers, sagas.**

**It's SUPER important for us to be sure that a candidate can follow existing coding culture**.

---

Will be a plus if you:
- Implement form with redux-form
- Add validation to prevent submitting empty or < 3 letters company name
- Use material-ui library
- Implement button on `/companies` page which will generate 100 random companies, stores them on the server and displays in the list
    - These companies will have understandable words as the names
- make simple client side pagination for `/companies` page



### Deliver your work:
- fork these repositories:
    -  React app: https://github.com/WatchTowerBenefits/wt_javascript_test
    -  Rails app: https://github.com/WatchTowerBenefits/wt_rails_test
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
