var getUserResponse = function() {
    var userInterface = COSAlertWindow.new();
    var textField = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,250,25));

    userInterface.setMessageText("Set Text");
    userInterface.setInformativeText("Move original text: *");

    textField.setStringValue("");
    userInterface.addAccessoryView(textField);

    userInterface.alert().window().setInitialFirstResponder(textField);

    userInterface.addButtonWithTitle("Set");
    userInterface.addButtonWithTitle("Cancel");

    return {
        result: userInterface.runModal(),
        text: textField.stringValue()
    };
};

var setText = function(text, layers) {
    var layer, oldValue, textToSet;
    var applyAtLeastOnce = 0;

    for (var i=0; i<layers.count(); i++) {
        layer = layers[i];

        if (layer.class() == MSTextLayer) {
            applyAtLeastOnce++;
            oldValue = layer.stringValue();
            textToSet = text.replace(/\*/g, oldValue);
            layer.setStringValue(textToSet);
            layer.setName(textToSet);
        }
    }
    return applyAtLeastOnce;
};

var onRun = function (context) {
    var doc = context.document;
    var selection = context.selection;
    var APPLY = 1000;

    if (selection.count() == 0) {
        doc.showMessage('Select at least one text layer');
        return;
    }

    var response = getUserResponse();

    if (response.result === APPLY) {
        var text = response.text.trim();

        if (text.length !== 0) {
            var applyCount = setText(text, selection);
            doc.showMessage(applyCount ?
                'Processed layers: ' + applyCount :
                'Select at least one text layer');
        } else {
            doc.showMessage('Text can\'t be blank');
        }
    }
}
