import Input from '@/base/Input';
import TextArea from '@/base/TextArea';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const tools = [
    'textbox',
    'image',
    'large-textbox',
    'select',
    'range'
]



const TemplatePage = () => {
    const [templates, setTemplates] = React.useState<any>([]);

    return (
        <div className='flex justify-between '>
            <Input
                placeholder='hello'
                onChange={(value) => {
                    console.log(value);
                }}
                onBlur={() => {
                    console.log('blur')
                }}
                onFocus={() => {
                    console.log('focus')
                }}
            />
            <div className='flex gap-2'>
                {
                    tools.map((item, index) => {
                        return (
                            <button key={index} className='btn btn-primary btn-xs '>
                                <FontAwesomeIcon
                                    icon={faAdd}
                                />
                                {
                                    item === 'large-textbox' ? 'Large text box ' : item
                                }
                            </button>
                        )
                    })
                }
            </div>
            <div>
                {
                    templates.map((item: any, index: number) => {
                        return (
                            <div key={index} className='flex justify-between items-center'>
                                <input
                                    type="text"
                                    className='input input-bordered'
                                    value={item.name}
                                    onChange={(e) => {
                                        const newTemplates = [...templates];
                                        newTemplates[index].name = e.target.value;
                                        setTemplates(newTemplates)
                                    }}
                                />
                                <button className='btn btn-primary btn-xs '
                                    onClick={() => {
                                        const newTemplates = [...templates];
                                        newTemplates.splice(index, 1);
                                        setTemplates(newTemplates)
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faAdd}
                                    />
                                </button>
                            </div>

                        )
                    })
                }
            </div>
            <button className='btn btn-primary btn-xs '
                onClick={() => {
                    setTemplates([...templates, { id: templates.length, name: 'New Template' }])
                }}
            >
                <FontAwesomeIcon
                    icon={faAdd}
                />
            </button>
        </div>
    )
}

export default TemplatePage