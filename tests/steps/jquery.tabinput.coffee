LOCATION = 'http://localhost:8080'

describe 'jQuery Tabinput [003]', ->
  beforeEach ->
    cy
      .visit(LOCATION)

  context 'All Input Fields [004]', ->
    it 'should initialize with the jquery.tabinput dom nodes [005]', ->
      cy
        .get('#tabinput-date1').next()
          .should('have.class', 'tabinput')
          .should('have.descendants', '.tabinput-input')
          .should('have.descendants', '.tabinput-seperator')
        .get('#tabinput-date2').next()
          .should('have.class', 'tabinput')
          .should('have.descendants', '.tabinput-input')
          .should('have.descendants', '.tabinput-seperator')
        .get('#tabinput-cc1').next()
          .should('have.class', 'tabinput')
          .should('have.descendants', '.tabinput-input')
          .should('have.descendants', '.tabinput-seperator')

  context 'Input Fields with Placeholders and Values [00g]', ->
    it 'should have the correct value in each block [00h]', ->
      cy
        # Has Value
        .get('#tabinput-date1').next().within ->
          cy
            .get('.tabinput-input').eq(0).its('text').should('eq', '01')
            .get('.tabinput-input').eq(1).its('text').should('eq', '31')
            .get('.tabinput-input').eq(2).its('text').should('eq', '2015')

        # Has Placeholder
        .get('#tabinput-date2').next().within ->
          cy
            .get('.tabinput-input').eq(0).its('text').should('eq', 'YYYY')
            .get('.tabinput-input').eq(1).its('text').should('eq', 'MM')
            .get('.tabinput-input').eq(2).its('text').should('eq', 'DD')

  context 'First date input field [014]', ->
    it 'it should be able to navigate blocks with the arrow keys [015]', ->
      cy
        .get('#tabinput-date1').next().click()
          .focused().its('text').should('eq', '01')
          .focused().type('{rightarrow}')
          .focused().its('text').should('eq', '31')
          .focused().type('{rightarrow}')
          .focused().its('text').should('eq', '2015')
          .focused().type('{leftarrow}')
          .focused().its('text').should('eq', '31')
          .focused().type('{leftarrow}')
          .focused().its('text').should('eq', '01')

