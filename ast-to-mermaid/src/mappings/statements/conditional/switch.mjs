/**
 * Switch Statement Logic
 * Maps a switch statement to flowchart components irrespective of programming language.
 */

export function mapSwitch(node, { builder, prevId, entryLabel, mapper, processSequence, disableFallthrough = false }) {
    // 1. Get the switch condition
    // For Python, it might be match statement, but config should normalize this.
    const conditionText = mapper.getCondition(node) || 'switch';
    const switchNodeId = builder.addSwitchStatement(node, conditionText);

    // Link from previous node
    if (prevId) {
        builder.link(prevId, switchNodeId, entryLabel);
    }

    // 2. Process Cases
    // In our config, extractThenBranch for switch returns the children of switch_body
    const casesNodes = mapper.getThenBranch(node) || [];

    let lastIds = [];
    let exitLabels = [];
    let caseCount = 0;
    let pendingFallthroughIds = [];

    for (let i = 0; i < casesNodes.length; i++) {
        const caseNode = casesNodes[i];
        if (!caseNode) continue;

        // C/C++/Java/TS/JS/Python handle case branches with various node types
        if (caseNode.type === 'switch_case' ||
            caseNode.type === 'case_clause' ||
            caseNode.type === 'switch_default' ||
            caseNode.type === 'switch_block_statement_group' || // Java
            caseNode.type === 'switch_rule' || // Java (New arrow syntax)
            caseNode.type === 'case_statement' // C, C++
        ) {
            caseCount++;

            let caseLabels = [];
            let isDefault = caseNode.type === 'switch_default';

            // 1. Identify all labels (values) for this case branch
            const labelNodes = caseNode.children?.filter(c => c && (c.type === 'switch_label' || c.type === 'case_pattern')) || [];

            // Check for Python-style guards (if clause)
            const ifClause = caseNode.children?.find(c => c && c.type === 'if_clause');
            const guardText = ifClause ? ` [${ifClause.text}]` : '';

            if (labelNodes.length > 0) {
                for (const lNode of labelNodes) {
                    if (lNode.text.includes('default') || lNode.type === 'default' || lNode.text.trim() === '_') {
                        isDefault = true;
                        caseLabels.push('default');
                    } else {
                        // Extract all values from label (handles Java 12+: case 1, 2)
                        const vals = lNode.children?.filter(c => c && c.named &&
                            c.type !== 'case' &&
                            c.type !== ':' &&
                            c.type !== '->' &&
                            !c.type.includes('statement') &&
                            !c.type.includes('block')) || [];

                        if (vals.length > 0) {
                            vals.forEach(v => caseLabels.push(v.text));
                        } else if (lNode.text) {
                            const cleanLabel = lNode.text.replace(/case\s+/, '').replace(/:$/, '').replace(/->$/, '').trim();
                            if (cleanLabel) caseLabels.push(cleanLabel);
                        }
                    }
                }
            } else {
                // Fallback for JS/TS/C/C++ where case statement might be its own parent
                if (caseNode.text && (caseNode.text.startsWith('default') || caseNode.text.trim().startsWith('_'))) {
                    isDefault = true;
                    caseLabels.push('default');
                } else {
                    const vals = caseNode.children?.filter(c => c && c.named &&
                        c.type !== 'case' &&
                        c.type !== ':' &&
                        c.type !== 'switch_label' &&
                        c.type !== 'case_pattern' &&
                        c.type !== '->' &&
                        !c.type.includes('statement') &&
                        !c.type.includes('block')) || [];

                    if (vals.length > 0) {
                        vals.forEach(v => caseLabels.push(v.text));
                    } else {
                        const cleanLabel = caseNode.text.split(':')[0].replace(/case\s+/, '').trim();
                        if (cleanLabel) caseLabels.push(cleanLabel);
                    }
                }
            }

            let caseLabel = isDefault ? 'default' : `case:${caseLabels.join(', ')}${guardText}`;
            if (!caseLabel || caseLabel === 'case:') caseLabel = isDefault ? 'default' : 'case';

            // Create an explicit node for the case statement itself
            const caseNodeId = builder.addCaseStatement(caseNode, caseLabel);
            builder.link(switchNodeId, caseNodeId, "");

            // If there were pending fallthroughs from previous cases, link them here
            if (pendingFallthroughIds.length > 0) {
                for (const pId of pendingFallthroughIds) {
                    builder.link(pId, caseNodeId, "fallthrough");
                }
                pendingFallthroughIds = [];
            }

            // Extract statements for this case
            let caseStmts = [];
            let foundDelimiter = false;

            // For Python: body is usually under 'block'
            // For Java: statements are directly children after the 'switch_label'
            // For C/C++: statements are children after the ':'
            // For TS/JS: statements are children after the ':' or in a 'statement_block'
            const blockChild = caseNode.children?.find(c => c && (c.type === 'block' || c.type === 'statement_block' || c.type === 'compound_statement'));
            if (blockChild) {
                caseStmts = blockChild.children?.filter(c => c && c.named && c.type !== '{' && c.type !== '}') || [];
            } else {
                for (const child of caseNode.children || []) {
                    if (child.type === ':' || child.type === 'switch_label' || child.type === 'case_pattern' || child.type === '->') {
                        foundDelimiter = true;
                        continue;
                    }
                    if (foundDelimiter && child.named) {
                        caseStmts.push(child);
                    }
                }
            }

            if (caseStmts.length > 0) {
                const branchResult = processSequence(caseStmts, caseNodeId, "");

                // Check if the branch ends in a break, return, or throw (to prevent fallthrough)
                const lastStmt = caseStmts[caseStmts.length - 1];
                let hasExit = disableFallthrough ||
                    caseNode.type === 'switch_rule' || // Java arrow rules do not fall through
                    (lastStmt && (
                        lastStmt.type.includes('break') ||
                        lastStmt.type.includes('return') ||
                        lastStmt.type.includes('throw') ||
                        // Also check for blocks ending in break
                        (lastStmt.text && (lastStmt.text.includes('break;') || lastStmt.text.includes('return ')))
                    ));

                if (hasExit) {
                    lastIds.push(...branchResult.lastIds);
                    for (let j = 0; j < branchResult.lastIds.length; j++) exitLabels.push("");
                } else {
                    // It falls through!
                    pendingFallthroughIds.push(...branchResult.lastIds);
                }
            } else {
                // Empty case (fallthrough)
                if (disableFallthrough) {
                    lastIds.push(caseNodeId);
                    exitLabels.push("");
                } else {
                    pendingFallthroughIds.push(caseNodeId);
                }
            }
        }
    }

    // Capture any final fallthroughs to the exit
    if (pendingFallthroughIds.length > 0) {
        lastIds.push(...pendingFallthroughIds);
        for (let j = 0; j < pendingFallthroughIds.length; j++) exitLabels.push("");
    }

    // If there were no cases at all
    if (caseCount === 0 || lastIds.length === 0) {
        lastIds.push(switchNodeId);
        exitLabels.push("");
    }

    // 3. Create a Virtual Reference Point for clean merge
    const mergePoint = builder.createVirtualPoint(lastIds, exitLabels);

    return {
        lastIds: [mergePoint],
        exitLabels: [""]
    };
}
