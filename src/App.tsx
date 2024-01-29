import React from 'react'
import './App.css'
import { markdownToHTML } from './core/markdownToHTML'

const MARKDOWN =
  '# 1 Timothy 1 General Notes\n\n## Structure and Formatting\n\n1. Letter opening (1:1–2)\n2. Paul urges Timothy to condemn false teachers (1:3–11)\n      * Paul commands Timothy to silence the false teachers (1:3–7)\n      * The purpose of the law (1:8–11)\n3. Paul thanks Jesus and praises God (1:12–17)\n4. Paul warns and encourages Timothy (1:18–20)\n\n## Special Concepts in This Chapter\n\n### The prophecies about Timothy\n\nIn [1:18](../01/18.md), Paul indicates that there were prophecies about Timothy. Paul implies that the prophecies are related to how Timothy will faithfully serve God by proclaiming the gospel. It is not clear when these prophecies were given. They may have been given before Timothy was born, when he was a child, when he became a believer, or when he was commissioned to serve with Paul. It is also not clear who gave these prophecies. When you translate this verse, it is best to refer to these prophecies with as few details as Paul gives.\n\n## Important Figures of Speech in This Chapter\n\n### Spiritual children\n\nIn [1:2](../01/02.md), Paul calls Timothy a “genuine child in the faith.” He means that Timothy is like a legitimate son to him in the context of their faith in Jesus. The phrase implies that Paul is a mentor to Timothy and that Timothy is a good student. When Paul again calls Timothy “child” in [1:18](../01/18.md), he means something very similar: Paul is Timothy’s mentor in the context of their faith in Jesus. Since the use of family language for fellow believers is an important metaphor in the New Testament, if possible preserve the metaphor or express the idea in simile form. See the notes on these verses for translation options. (See: [[rc://*/ta/man/translate/figs-metaphor]])\n\n### Fighting the good fight\n\nIn [1:18](../01/18.md), Paul exhorts Timothy to “fight the good fight.” He compares how Timothy must serve God by proclaiming the gospel to how soldiers fight in a war. He implies that Timothy will experience conflict, danger, and hardship and that he must obey God and Paul as a soldier obeys his commanders. Since Paul uses warfare language to refer to the Christian life in many verses, if possible preserve the metaphor or express the idea in simile form. See the notes on this verse for translation options. (See: [[rc://*/ta/man/translate/figs-metaphor]])\n\n### Shipwrecked regarding the faith\n\nIn [1:19](../01/19.md), Paul refers to people who “have shipwrecked regarding the faith.” As a ship breaks apart and sinks, the faith of these people has ceased to function properly. They do not believe in Jesus any longer. If your readers would not be familiar with shipwrecks, you could consider using a comparable metaphor or stating the meaning plainly. See the notes on this verse for translation options. (See: [[rc://*/ta/man/translate/figs-metaphor]])\n\n## Other Possible Translation Difficulties in This Chapter\n\n### The list in [1:9–10](../01/09.md)\n\nIn these verses, Paul provides a list of some of the kinds of people for whom the law was given. Paul gives four pairs of words connected with “and,” six individual words, and then a concluding phrase. You may need to break this long list into multiple different sentences, as the UST does. If you do, you could still preserve the general structure of Paul’s list, as the UST does in most places. Consider how you would include a list of this kind in your language.'

function App() {
  const markdownHtml = markdownToHTML(MARKDOWN)

  return (
    <>
      <h1>HTML Content:</h1>
      <div dangerouslySetInnerHTML={{ __html: markdownHtml }} />
    </>
  )
}

export default App
