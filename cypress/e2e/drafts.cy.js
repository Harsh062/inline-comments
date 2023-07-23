

context.only("/", () => {
  beforeEach(() => {});

  after(() => {
    cy.clearLocalStorage();
  });
  describe('Test draft edit, highlight, add and delete comment flows', () => {
    it('Tests', () => {
      // Visit home page
      cy.visit("http://localhost:3000");

      // Click on side draft items in the sidebar
      cy.get("[data-cy=draftHeaderListItem]");
      cy.get("[data-cy=draftHeaderListItem]").should('have.length', 5);
      cy.get("[data-cy=draftHeaderListItem]").click({ multiple: true });

      // Select/highlight a text in the draft content (33242342347 is the draftId of the last draft item that will be clicked)
      cy.get('[data-cy="33242342347"]').highlightText("or avoids");

      // Click on Add Comment tooltip
      cy.get("[data-cy=tooltip]");
      cy.get("[data-cy=tooltip]").click();

      // Type in the comment text
      cy.get('textarea');
      cy.get('textarea').type('First comment via cypress');

      // Save the comment
      cy.get("[data-cy=saveFirstCommentButton]");
      cy.get("[data-cy=saveFirstCommentButton]").click();

      // Check if toast is visible on successful add comment
      cy.get("[data-cy=toastContainer]");

      // Reply to existing comment
      cy.get("[data-cy=addCommentsToThreadTextBox]");
      cy.get('textarea').type('Reply to existing comment via cypress');

      // Delete the entered comment
      cy.get("[data-cy=deleteCommentButton]");
      cy.get("[data-cy=deleteCommentButton]").click();

      // Add another comment to test close button functionality
      cy.get('[data-cy="33242342347"]').highlightText("human happiness");
      cy.get("[data-cy=tooltip]").click();
      cy.get('textarea').type('Another comment via cypress');
      cy.get("[data-cy=saveFirstCommentButton]").click();
      // Close the comment thread
      cy.get("[data-cy=closeCommentsButton]");
      cy.get("[data-cy=closeCommentsButton]").click();
     

      // Click on highlighted text
      cy.wait(1000);
      cy.get("span");
      cy.get("span").click();

      // Check if the previously added comment is loaded, then close this section
      cy.get('.card-text');
      cy.get('.card-text').should('have.length', 1);
      cy.get("[data-cy=closeCommentsButton]").click();

      // Edit draft
      cy.get("[data-cy=editDraftButton]");
      cy.get("[data-cy=editDraftButton]").click();

      // Save draft
      cy.get("[data-cy=saveDraftButton]");
      cy.get("[data-cy=saveDraftButton]").click();

    })
  })
});
