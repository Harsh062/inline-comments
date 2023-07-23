Cypress.Commands.add("selectText", { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject).trigger("mousedown").then(fn).trigger("mouseup");

  cy.document().trigger("selectionchange");
  return cy.wrap(subject);
});


Cypress.Commands.add(
  "highlightText",
  { prevSubject: true },
  (subject, query, endQuery) => {
    return cy.wrap(subject).selectText(($el) => {
      if (typeof query === "string") {
        const anchorNode = getTextNode($el[0], query);
        const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode;
        const anchorOffset = anchorNode.wholeText.indexOf(query);
        const focusOffset = endQuery
          ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
          : anchorOffset + query.length;
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      } else if (typeof query === "object") {
        const el = $el[0];
        const anchorNode = getTextNode(el.querySelector(query.anchorQuery));
        const anchorOffset = query.anchorOffset || 0;
        const focusNode = query.focusQuery
          ? getTextNode(el.querySelector(query.focusQuery))
          : anchorNode;
        const focusOffset = query.focusOffset || 0;
        setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
      }
    });
  }
);

const getTextNode = (el, match) => {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
  if (!match) {
    return walk.nextNode();
  }

  let node;
  while ((node = walk.nextNode())) {
    if (node.wholeText.includes(match)) {
      return node;
    }
  }
};

const setBaseAndExtent = (...args) => {
  const document = args[0].ownerDocument;
  document.getSelection().removeAllRanges();
  document.getSelection().setBaseAndExtent(...args);
};
